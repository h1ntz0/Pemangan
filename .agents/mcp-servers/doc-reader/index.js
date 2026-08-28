#!/usr/bin/env node

const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { CallToolRequestSchema, ListToolsRequestSchema } = require("@modelcontextprotocol/sdk/types.js");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const ExcelJS = require("exceljs");

const server = new Server(
  {
    name: "doc-reader-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "read_pdf",
        description: "Ekstrak dan baca seluruh isi teks dari dokumen PDF (.pdf) secara lengkap dan terstruktur.",
        inputSchema: {
          type: "object",
          properties: {
            filePath: {
              type: "string",
              description: "Absolute path atau relative path ke file .pdf",
            },
            maxPages: {
              type: "number",
              description: "Maksimal halaman yang dibaca (opsional, default: semua halaman)",
            },
          },
          required: ["filePath"],
        },
      },
      {
        name: "read_docx",
        description: "Ekstrak dan baca isi dokumen Microsoft Word (.docx / .doc) dalam format plain text atau markdown.",
        inputSchema: {
          type: "object",
          properties: {
            filePath: {
              type: "string",
              description: "Absolute path atau relative path ke file .docx",
            },
            format: {
              type: "string",
              enum: ["markdown", "text", "html"],
              description: "Format output yang diinginkan (default: markdown)",
            },
          },
          required: ["filePath"],
        },
      },
      {
        name: "read_excel",
        description: "Baca dan ekstraksi data spreadsheet Excel (.xlsx / .xls) per sheet dalam format tabel Markdown atau CSV yang rapi.",
        inputSchema: {
          type: "object",
          properties: {
            filePath: {
              type: "string",
              description: "Absolute path atau relative path ke file .xlsx / .xls",
            },
            sheetName: {
              type: "string",
              description: "Nama sheet tertentu yang ingin dibaca (opsional, default: semua sheet)",
            },
            outputFormat: {
              type: "string",
              enum: ["markdown", "csv", "json"],
              description: "Format representasi data (default: markdown)",
            },
            maxRows: {
              type: "number",
              description: "Batas maksimal baris per sheet (opsional, default: 500)",
            },
          },
          required: ["filePath"],
        },
      },
      {
        name: "read_document",
        description: "Auto-detect dan baca dokumen apa saja (.pdf, .docx, .xlsx, .xls, .csv, .txt, .md) secara otomatis berdasarkan ekstensi file.",
        inputSchema: {
          type: "object",
          properties: {
            filePath: {
              type: "string",
              description: "Path ke file dokumen apa saja",
            },
          },
          required: ["filePath"],
        },
      },
    ],
  };
});

async function parsePdfFile(filePath, maxPages) {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`File tidak ditemukan: ${resolved}`);
  }
  const dataBuffer = fs.readFileSync(resolved);
  const options = {};
  if (maxPages && typeof maxPages === "number") {
    options.max = maxPages;
  }
  const data = await pdfParse(dataBuffer, options);
  return `### PDF Document: ${path.basename(resolved)}\n` +
         `- **Jumlah Halaman**: ${data.numpages}\n` +
         `- **Info**: ${JSON.stringify(data.info || {})}\n\n` +
         `#### Isi Dokumen:\n\n${data.text}`;
}

async function parseDocxFile(filePath, format = "markdown") {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`File tidak ditemukan: ${resolved}`);
  }

  if (format === "html") {
    const res = await mammoth.convertToHtml({ path: resolved });
    return res.value;
  } else if (format === "text") {
    const res = await mammoth.extractRawText({ path: resolved });
    return `### Word Document: ${path.basename(resolved)}\n\n${res.value}`;
  } else {
    // default markdown / clean format
    const res = await mammoth.extractRawText({ path: resolved });
    return `### Word Document: ${path.basename(resolved)}\n\n${res.value}`;
  }
}

async function parseExcelFile(filePath, targetSheet, outputFormat = "markdown", maxRows = 500) {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`File tidak ditemukan: ${resolved}`);
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(resolved);

  let output = `# Excel Document: ${path.basename(resolved)}\n\n`;
  let sheets = workbook.worksheets;

  if (targetSheet) {
    sheets = sheets.filter(s => s.name.toLowerCase() === targetSheet.toLowerCase());
    if (sheets.length === 0) {
      throw new Error(`Sheet "${targetSheet}" tidak ditemukan di file ${path.basename(resolved)}`);
    }
  }

  for (const sheet of sheets) {
    output += `## Sheet: ${sheet.name} (Total Baris: ${sheet.rowCount}, Kolom: ${sheet.columnCount})\n\n`;

    if (outputFormat === "csv") {
      let csvContent = "";
      let count = 0;
      sheet.eachRow({ includeEmpty: true }, (row) => {
        if (count >= maxRows) return;
        const vals = [];
        row.eachCell({ includeEmpty: true }, (cell) => {
          let v = String(cell.value != null ? (cell.text || cell.value) : "");
          v = v.replace(/"/g, '""').replace(/\n/g, " ");
          vals.push(`"${v}"`);
        });
        csvContent += vals.join(",") + "\n";
        count++;
      });
      output += "```csv\n" + csvContent + "```\n\n";
    } else if (outputFormat === "json") {
      const rows = [];
      let count = 0;
      sheet.eachRow({ includeEmpty: false }, (row) => {
        if (count >= maxRows) return;
        const rVals = [];
        row.eachCell({ includeEmpty: true }, (cell) => {
          rVals.push(cell.text || cell.value);
        });
        rows.push(rVals);
        count++;
      });
      output += "```json\n" + JSON.stringify(rows, null, 2) + "\n```\n\n";
    } else {
      // Markdown Table
      let tableRows = [];
      let count = 0;
      let maxCols = 0;

      sheet.eachRow({ includeEmpty: true }, (row) => {
        if (count >= maxRows) return;
        const rVals = [];
        row.eachCell({ includeEmpty: true }, (cell) => {
          let val = String(cell.text || cell.value || "").replace(/\|/g, "\\|").replace(/\n/g, " ");
          rVals.push(val.trim());
        });
        if (rVals.length > maxCols) maxCols = rVals.length;
        tableRows.push(rVals);
        count++;
      });

      if (tableRows.length > 0) {
        // Pad all rows to maxCols
        tableRows = tableRows.map(r => {
          while (r.length < maxCols) r.push("");
          return r;
        });

        // Header row
        const header = tableRows[0];
        output += "| " + header.map((h, i) => h || `Col ${i + 1}`).join(" | ") + " |\n";
        output += "| " + header.map(() => "---").join(" | ") + " |\n";

        // Body rows
        for (let i = 1; i < tableRows.length; i++) {
          output += "| " + tableRows[i].join(" | ") + " |\n";
        }
        output += "\n";
      } else {
        output += "_Sheet kosong_\n\n";
      }
    }
  }

  return output;
}

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "read_pdf") {
      const result = await parsePdfFile(args.filePath, args.maxPages);
      return { content: [{ type: "text", text: result }] };
    }

    if (name === "read_docx") {
      const result = await parseDocxFile(args.filePath, args.format);
      return { content: [{ type: "text", text: result }] };
    }

    if (name === "read_excel") {
      const result = await parseExcelFile(args.filePath, args.sheetName, args.outputFormat, args.maxRows);
      return { content: [{ type: "text", text: result }] };
    }

    if (name === "read_document") {
      const ext = path.extname(args.filePath).toLowerCase();
      if (ext === ".pdf") {
        const res = await parsePdfFile(args.filePath);
        return { content: [{ type: "text", text: res }] };
      } else if (ext === ".docx" || ext === ".doc") {
        const res = await parseDocxFile(args.filePath);
        return { content: [{ type: "text", text: res }] };
      } else if (ext === ".xlsx" || ext === ".xls") {
        const res = await parseExcelFile(args.filePath);
        return { content: [{ type: "text", text: res }] };
      } else {
        // Plain text fallback
        const content = fs.readFileSync(path.resolve(args.filePath), "utf-8");
        return { content: [{ type: "text", text: content }] };
      }
    }

    throw new Error(`Tool tidak ditemukan: ${name}`);
  } catch (err) {
    return {
      isError: true,
      content: [{ type: "text", text: `Error membaca file: ${err.message}` }],
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(err => {
  console.error("Fatal server error:", err);
  process.exit(1);
});
