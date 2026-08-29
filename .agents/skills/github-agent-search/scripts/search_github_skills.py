#!/usr/bin/env python3
"""
GitHub Skills & AI Agent Pattern Discovery Tool
Queries GitHub API / public repositories for high-impact AI agent skills, MCP tools, and agentic workflows.
"""

import sys
import json
import urllib.request
import urllib.parse
import os

def search_github(query, category="repositories", sort="stars", order="desc", per_page=10):
    headers = {
        "User-Agent": "Antigravity-Agent-Skill-Discovery/1.0",
        "Accept": "application/vnd.github.v3+json"
    }
    
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
        
    encoded_q = urllib.parse.quote_plus(query)
    url = f"https://api.github.com/search/{category}?q={encoded_q}&sort={sort}&order={order}&per_page={per_page}"
    
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            if response.status == 200:
                data = json.loads(response.read().decode('utf-8'))
                return data
    except Exception as e:
        return {"error": str(e)}
    return {"error": "Failed to retrieve results"}

def format_repo_results(data):
    if "error" in data:
        print(f"[Error] {data['error']}")
        return
        
    items = data.get("items", [])
    total = data.get("total_count", 0)
    print(f"\n=======================================================")
    print(f"  GitHub AI Agent Discovery: Found {total} Repositories")
    print(f"=======================================================\n")
    
    for idx, item in enumerate(items, 1):
        name = item.get("full_name")
        stars = item.get("stargazers_count", 0)
        desc = item.get("description") or "(No description provided)"
        url = item.get("html_url")
        topics = ", ".join(item.get("topics", [])[:5])
        updated = item.get("updated_at", "")[:10]
        
        print(f"{idx}. {name} [⭐ {stars:,} | Updated: {updated}]")
        print(f"   URL: {url}")
        print(f"   Desc: {desc}")
        if topics:
            print(f"   Tags: {topics}")
        print("-" * 55)

if __name__ == "__main__":
    query = sys.argv[1] if len(sys.argv) > 1 else "topic:ai-agent topic:mcp stars:>500"
    results = search_github(query)
    format_repo_results(results)
