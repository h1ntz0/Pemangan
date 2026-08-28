---
name: github-agent-search
description: >-
  Search, discover, evaluate, and integrate state-of-the-art AI agent skills, prompts, tools, and workflows from GitHub repositories and open-source ecosystems. Use this skill when looking for best-in-class AI agent capabilities, agent patterns, or GitHub-based AI workflow implementations.
---

# GitHub AI Agent Skills Discovery & Integration

This skill guides the agent in searching GitHub for the highest quality AI agent tools, prompt recipes, MCP servers, and autonomous workflows, evaluating their suitability, and integrating them into the project.

---

## 1. Quick Discovery Workflow

### Step 1: Run Search Query
Execute the bundled discovery script:
```bash
python3 .agents/skills/github-agent-search/scripts/search_github_skills.py "<SEARCH_QUERY>"
```
Examples of queries:
* MCP tools: `"topic:mcp topic:ai-agent stars:>200"`
* Code intelligence: `"codebase-memory" OR "codegraph" topic:mcp`
* Web automation: `topic:playwright-mcp OR topic:browser-agent`

### Step 2: Evaluate Repository Quality
Assess the candidate repository with the evaluator tool:
```bash
python3 .agents/skills/github-agent-search/scripts/evaluate_agent_skill.py <owner/repo>
```

### Step 3: Extract & Implement Patterns
1. Check the repo's README, schemas, and tool specifications.
2. Adapt the skill/tool pattern into `.agents/skills/` or `.agents/mcp_config.json`.
3. Verify zero errors by running a local test execution.

---

## 2. References & Guides

* [Top AI Agent Skills & Patterns](./references/top_agent_skills.md)
* [Advanced GitHub Search Queries](./references/github_search_queries.md)
