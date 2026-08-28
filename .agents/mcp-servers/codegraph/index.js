#!/usr/bin/env node

/**
 * CodeGraph MCP Server
 * Standard Model Context Protocol (MCP) server for codebase knowledge graphing,
 * symbol indexing, AST parsing, and relationship tracing.
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const SERVER_NAME = "codegraph-mcp-server";
const SERVER_VERSION = "1.0.0";
const PROTOCOL_VERSION = "2024-11-05";

// In-memory knowledge graph store
const graphStore = {
  rootPath: process.cwd(),
  lastIndexed: null,
  files: new Map(), // filePath -> { symbols: [], imports: [], exports: [], lines: number }
  symbols: new Map(), // name -> [ { file, line, type, signature } ]
  dependencies: new Map() // file -> Set<file>
};

// Simple yet powerful regex-based multi-language symbol extractor
function parseFileSymbols(filePath, content) {
  const ext = path.extname(filePath).toLowerCase();
  const lines = content.split('\n');
  const symbols = [];
  const imports = [];
  const exports = [];

  const functionRegexJS = /(?:function\s+([a-zA-Z0-9_$]+)|(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>|(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*function|(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*\{|([a-zA-Z0-9_$]+)\s*\([^)]*\)\s*\{)/g;
  const classRegex = /class\s+([a-zA-Z0-9_$]+)(?:\s+extends\s+([a-zA-Z0-9_$]+))?/g;
  const importRegexJS = /(?:import\s+(?:\{([^}]+)\}|([a-zA-Z0-9_$]+))\s+from\s+['"]([^'"]+)['"]|require\(['"]([^'"]+)['"]\))/g;
  const pyFunctionRegex = /def\s+([a-zA-Z0-9_]+)\s*\([^)]*\):/g;
  const pyClassRegex = /class\s+([a-zA-Z0-9_]+)(?:\([^)]*\))?:/g;

  lines.forEach((lineText, idx) => {
    const lineNum = idx + 1;
    const trimmed = lineText.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('/*')) return;

    if (['.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx'].includes(ext)) {
      // JS/TS Functions
      let match;
      while ((match = functionRegexJS.exec(lineText)) !== null) {
        const name = match[1] || match[2] || match[3] || match[4];
        if (name && !['if', 'for', 'while', 'switch', 'catch'].includes(name)) {
          symbols.push({ name, type: 'function', line: lineNum, preview: trimmed.slice(0, 100) });
        }
      }

      // Classes
      while ((match = classRegex.exec(lineText)) !== null) {
        const name = match[1];
        if (name) {
          symbols.push({ name, type: 'class', line: lineNum, preview: trimmed.slice(0, 100), parent: match[2] || null });
        }
      }

      // Imports
      while ((match = importRegexJS.exec(lineText)) !== null) {
        const target = match[3] || match[4] || '';
        const importedItems = match[1] ? match[1].split(',').map(s => s.trim()) : [match[2]].filter(Boolean);
        imports.push({ target, items: importedItems, line: lineNum });
      }

      // Exports
      if (trimmed.startsWith('export ') || trimmed.includes('module.exports')) {
        exports.push({ line: lineNum, preview: trimmed.slice(0, 100) });
      }
    } else if (['.py'].includes(ext)) {
      let match;
      while ((match = pyFunctionRegex.exec(lineText)) !== null) {
        symbols.push({ name: match[1], type: 'function', line: lineNum, preview: trimmed.slice(0, 100) });
      }
      while ((match = pyClassRegex.exec(lineText)) !== null) {
        symbols.push({ name: match[1], type: 'class', line: lineNum, preview: trimmed.slice(0, 100) });
      }
    } else if (['.html', '.htm'].includes(ext)) {
      const idMatch = /id=["']([^"']+)["']/g;
      let match;
      while ((match = idMatch.exec(lineText)) !== null) {
        symbols.push({ name: `#${match[1]}`, type: 'html-id', line: lineNum, preview: trimmed.slice(0, 100) });
      }
    } else if (['.css'].includes(ext)) {
      const classSelectorMatch = /\.([a-zA-Z0-9_-]+)\s*\{/g;
      let match;
      while ((match = classSelectorMatch.exec(lineText)) !== null) {
        symbols.push({ name: `.${match[1]}`, type: 'css-class', line: lineNum, preview: trimmed.slice(0, 100) });
      }
    }
  });

  return { symbols, imports, exports, linesCount: lines.length };
}

function indexDirectory(targetDir, maxFiles = 1000) {
  const supportedExts = new Set(['.js', '.ts', '.jsx', '.tsx', '.mjs', '.cjs', '.py', '.html', '.css', '.json', '.go', '.rs', '.java', '.md', '.sh']);
  const ignoreDirs = new Set(['node_modules', '.git', 'dist', 'build', '.system_generated', 'coverage', '.cache']);

  graphStore.files.clear();
  graphStore.symbols.clear();
  graphStore.dependencies.clear();
  graphStore.rootPath = targetDir;

  let fileCount = 0;

  function traverse(dir) {
    if (fileCount >= maxFiles) return;
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (e) {
      return;
    }

    for (const entry of entries) {
      if (entry.name.startsWith('.') && entry.name !== '.agents') continue;
      if (entry.isDirectory()) {
        if (!ignoreDirs.has(entry.name)) {
          traverse(path.join(dir, entry.name));
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (supportedExts.has(ext)) {
          const fullPath = path.join(dir, entry.name);
          const relPath = path.relative(targetDir, fullPath);
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            const parsed = parseFileSymbols(fullPath, content);
            graphStore.files.set(relPath, parsed);

            // Populate global symbol lookup
            parsed.symbols.forEach(sym => {
              const list = graphStore.symbols.get(sym.name) || [];
              list.push({ file: relPath, line: sym.line, type: sym.type, preview: sym.preview });
              graphStore.symbols.set(sym.name, list);
            });

            fileCount++;
          } catch (err) {
            // Ignore unreadable files
          }
        }
      }
    }
  }

  traverse(targetDir);
  graphStore.lastIndexed = new Date().toISOString();

  return {
    rootPath: targetDir,
    totalFiles: graphStore.files.size,
    totalUniqueSymbols: graphStore.symbols.size,
    indexedAt: graphStore.lastIndexed
  };
}

const TOOLS = [
  {
    name: "codegraph_index",
    description: "Scan and index codebase into a structural AST and symbol knowledge graph.",
    inputSchema: {
      type: "object",
      properties: {
        directory: {
          type: "string",
          description: "Root directory of the project to index. Defaults to current workspace."
        }
      }
    }
  },
  {
    name: "codegraph_query",
    description: "Search for symbols (functions, classes, IDs, methods) across the codebase knowledge graph.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Symbol name or pattern to search for."
        },
        symbolType: {
          type: "string",
          description: "Optional filter by type: 'function', 'class', 'html-id', 'css-class'."
        }
      },
      required: ["query"]
    }
  },
  {
    name: "codegraph_file_summary",
    description: "Get comprehensive symbol outline, declarations, imports, and exports for a specific file.",
    inputSchema: {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description: "Relative or absolute path to the file."
        }
      },
      required: ["filePath"]
    }
  },
  {
    name: "codegraph_architecture",
    description: "Generate high-level architectural overview, code metric distribution, and component map.",
    inputSchema: {
      type: "object",
      properties: {}
    }
  }
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

function sendResponse(id, result, error = null) {
  const payload = {
    jsonrpc: "2.0",
    id: id
  };
  if (error) {
    payload.error = error;
  } else {
    payload.result = result;
  }
  process.stdout.write(JSON.stringify(payload) + "\n");
}

function handleInitialize(id) {
  // Automatically perform initial index on startup
  indexDirectory(process.cwd());

  sendResponse(id, {
    protocolVersion: PROTOCOL_VERSION,
    capabilities: {
      tools: {}
    },
    serverInfo: {
      name: SERVER_NAME,
      version: SERVER_VERSION
    }
  });
}

function handleToolsList(id) {
  sendResponse(id, {
    tools: TOOLS
  });
}

async function handleToolCall(id, name, args) {
  try {
    if (name === "codegraph_index") {
      const target = args.directory ? path.resolve(args.directory) : process.cwd();
      const stats = indexDirectory(target);
      sendResponse(id, {
        content: [
          {
            type: "text",
            text: JSON.stringify(stats, null, 2)
          }
        ]
      });
      return;
    }

    if (name === "codegraph_query") {
      if (!graphStore.lastIndexed) indexDirectory(process.cwd());
      const query = (args.query || "").toLowerCase();
      const typeFilter = args.symbolType ? args.symbolType.toLowerCase() : null;

      const matches = [];
      for (const [symName, occurences] of graphStore.symbols.entries()) {
        if (symName.toLowerCase().includes(query)) {
          const filtered = typeFilter ? occurences.filter(o => o.type === typeFilter) : occurences;
          if (filtered.length > 0) {
            matches.push({ symbol: symName, matches: filtered });
          }
        }
      }

      sendResponse(id, {
        content: [
          {
            type: "text",
            text: JSON.stringify({ totalMatches: matches.length, results: matches.slice(0, 50) }, null, 2)
          }
        ]
      });
      return;
    }

    if (name === "codegraph_file_summary") {
      if (!graphStore.lastIndexed) indexDirectory(process.cwd());
      const rel = path.relative(graphStore.rootPath, path.resolve(args.filePath));
      const fileData = graphStore.files.get(rel) || graphStore.files.get(args.filePath);

      if (!fileData) {
        sendResponse(id, {
          content: [
            {
              type: "text",
              text: `File '${args.filePath}' is not currently in the indexed knowledge graph.`
            }
          ],
          isError: true
        });
        return;
      }

      sendResponse(id, {
        content: [
          {
            type: "text",
            text: JSON.stringify({ file: rel, ...fileData }, null, 2)
          }
        ]
      });
      return;
    }

    if (name === "codegraph_architecture") {
      if (!graphStore.lastIndexed) indexDirectory(process.cwd());
      const breakdown = {};
      let totalLines = 0;

      for (const [file, data] of graphStore.files.entries()) {
        const ext = path.extname(file) || 'other';
        breakdown[ext] = (breakdown[ext] || 0) + 1;
        totalLines += (data.linesCount || 0);
      }

      const summary = {
        root: graphStore.rootPath,
        indexedFiles: graphStore.files.size,
        totalLinesOfCode: totalLines,
        uniqueSymbols: graphStore.symbols.size,
        fileTypes: breakdown,
        indexedAt: graphStore.lastIndexed
      };

      sendResponse(id, {
        content: [
          {
            type: "text",
            text: JSON.stringify(summary, null, 2)
          }
        ]
      });
      return;
    }

    sendResponse(id, null, {
      code: -32601,
      message: `Tool '${name}' not found.`
    });
  } catch (err) {
    sendResponse(id, null, {
      code: -32603,
      message: `Internal error: ${err.message}`
    });
  }
}

rl.on('line', (line) => {
  if (!line.trim()) return;
  try {
    const msg = JSON.parse(line);
    if (!msg.jsonrpc) return;

    if (msg.method === "initialize") {
      handleInitialize(msg.id);
    } else if (msg.method === "notifications/initialized") {
      // client ack
    } else if (msg.method === "ping") {
      sendResponse(msg.id, {});
    } else if (msg.method === "tools/list") {
      handleToolsList(msg.id);
    } else if (msg.method === "tools/call") {
      handleToolCall(msg.id, msg.params?.name, msg.params?.arguments || {});
    } else if (msg.id !== undefined) {
      sendResponse(msg.id, null, {
        code: -32601,
        message: `Method '${msg.method}' not recognized.`
      });
    }
  } catch (err) {
    // Non-JSON
  }
});
