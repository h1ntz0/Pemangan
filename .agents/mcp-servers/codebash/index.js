#!/usr/bin/env node

/**
 * CodeBash MCP Server
 * Standard Model Context Protocol (MCP) server for robust shell & bash execution.
 */

const { exec, spawn } = require('child_process');
const readline = require('readline');
const os = require('os');
const path = require('path');
const fs = require('fs');

const SERVER_NAME = "codebash-mcp-server";
const SERVER_VERSION = "1.0.0";
const PROTOCOL_VERSION = "2024-11-05";

// Process line-by-line stdio JSON-RPC
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

function sendNotification(method, params = {}) {
  const payload = {
    jsonrpc: "2.0",
    method: method,
    params: params
  };
  process.stdout.write(JSON.stringify(payload) + "\n");
}

const TOOLS = [
  {
    name: "codebash_exec",
    description: "Execute a bash or shell command safely with working directory support, custom timeouts, and complete stdout/stderr output.",
    inputSchema: {
      type: "object",
      properties: {
        command: {
          type: "string",
          description: "The shell command to execute."
        },
        cwd: {
          type: "string",
          description: "Working directory for the command. Defaults to the current directory."
        },
        timeoutMs: {
          type: "number",
          description: "Timeout in milliseconds (default: 60000 ms)."
        },
        env: {
          type: "object",
          description: "Optional environment variables.",
          additionalProperties: { type: "string" }
        }
      },
      required: ["command"]
    }
  },
  {
    name: "codebash_script",
    description: "Execute a multi-line bash script with error trapping and formatted output.",
    inputSchema: {
      type: "object",
      properties: {
        script: {
          type: "string",
          description: "Bash script contents to run."
        },
        cwd: {
          type: "string",
          description: "Working directory."
        },
        timeoutMs: {
          type: "number",
          description: "Timeout in milliseconds (default: 60000 ms)."
        }
      },
      required: ["script"]
    }
  },
  {
    name: "codebash_system_info",
    description: "Get current system host info, platform, node version, memory, and environment details.",
    inputSchema: {
      type: "object",
      properties: {}
    }
  }
];

function handleInitialize(id, params) {
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
    if (name === "codebash_exec") {
      const command = args.command;
      const cwd = args.cwd ? path.resolve(args.cwd) : process.cwd();
      const timeout = args.timeoutMs || 60000;
      const customEnv = Object.assign({}, process.env, args.env || {});

      exec(command, { cwd, timeout, env: customEnv, maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
        let outputText = "";
        if (stdout) outputText += stdout;
        if (stderr) outputText += (outputText ? "\n[stderr]\n" : "") + stderr;
        if (err) {
          outputText += `\n[Process exited with code ${err.code !== undefined ? err.code : 'error'}: ${err.message}]`;
        }

        sendResponse(id, {
          content: [
            {
              type: "text",
              text: outputText || "(Command completed with no output)"
            }
          ],
          isError: !!err
        });
      });
      return;
    }

    if (name === "codebash_script") {
      const script = args.script;
      const cwd = args.cwd ? path.resolve(args.cwd) : process.cwd();
      const timeout = args.timeoutMs || 60000;

      const child = spawn("bash", ["-c", script], {
        cwd,
        timeout,
        env: process.env,
        stdio: ["pipe", "pipe", "pipe"]
      });

      let stdout = "";
      let stderr = "";

      child.stdout.on("data", (d) => { stdout += d.toString(); });
      child.stderr.on("data", (d) => { stderr += d.toString(); });

      child.on("close", (code) => {
        let result = stdout;
        if (stderr) result += (result ? "\n[stderr]\n" : "") + stderr;
        result += `\n[Script finished with exit code: ${code}]`;

        sendResponse(id, {
          content: [
            {
              type: "text",
              text: result
            }
          ],
          isError: code !== 0
        });
      });

      child.on("error", (err) => {
        sendResponse(id, {
          content: [
            {
              type: "text",
              text: `Error launching script: ${err.message}`
            }
          ],
          isError: true
        });
      });
      return;
    }

    if (name === "codebash_system_info") {
      const info = {
        platform: os.platform(),
        release: os.release(),
        arch: os.arch(),
        hostname: os.hostname(),
        cpus: os.cpus().length,
        totalMemoryMB: Math.round(os.totalmem() / 1024 / 1024),
        freeMemoryMB: Math.round(os.freemem() / 1024 / 1024),
        nodeVersion: process.version,
        cwd: process.cwd()
      };

      sendResponse(id, {
        content: [
          {
            type: "text",
            text: JSON.stringify(info, null, 2)
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
      handleInitialize(msg.id, msg.params);
    } else if (msg.method === "notifications/initialized") {
      // client ack, no response needed
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
    // Non-JSON input
  }
});

process.on('uncaughtException', (err) => {
  console.error('[CodeBash MCP Error]', err);
});
