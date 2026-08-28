---
name: ai-agent-master
description: >-
  Advanced autonomous AI agent execution patterns: ReAct loops, AST CodeGraph analysis, multi-agent coordination, self-correction, browser testing with Playwright, and persistent memory management. Use this skill when solving complex multi-step tasks requiring deep reasoning and multi-tool orchestration.
---

# Master AI Agent Execution & Reasoning Architecture

This skill provides an advanced framework for autonomous software engineering, verification, and tool orchestration.

---

## Core Execution Pillars

### 1. Codebase Graphing (`codegraph`)
* Before reading dozens of files, query the knowledge graph for relevant symbols and dependencies:
  - Find symbols: `codegraph_query`
  - Inspect dependencies: `codegraph_file_summary`
  - Get architectural distribution: `codegraph_architecture`

### 2. Verified Execution & Safe Shell (`codebash`)
* Run scripts and commands with explicit working directories, timeouts, and structured error traps.
* Always check exit codes and logs before declaring a task complete.

### 3. Browser End-to-End Testing & Stealth Automation (`playwright` & `camofox`)
* Verify web applications by taking page snapshots (`browser_snapshot`), interacting with UI elements (`browser_click`, `browser_fill`), and taking screenshots (`browser_take_screenshot`).
* Use `camofox` for stealth browser tasks requiring anti-bot / anti-fingerprinting evasion on complex web targets.

### 4. Memory Persistence (`memory`)
* Save critical user preferences, architectural rules, and session state into the knowledge graph to maintain context across turns.
