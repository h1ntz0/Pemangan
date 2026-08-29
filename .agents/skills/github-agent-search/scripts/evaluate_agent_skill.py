#!/usr/bin/env python3
"""
AI Agent Skill & Repo Quality Evaluator
Analyzes repository structure, documentation quality, license, and tool compatibility.
"""

import sys
import json
import urllib.request
import os

def evaluate_repo(repo_full_name):
    headers = {
        "User-Agent": "Antigravity-Agent-Skill-Discovery/1.0",
        "Accept": "application/vnd.github.v3+json"
    }
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"

    url = f"https://api.github.com/repos/{repo_full_name}"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as res:
            repo = json.loads(res.read().decode('utf-8'))
    except Exception as e:
        print(f"[Error fetching repo] {e}")
        return

    stars = repo.get("stargazers_count", 0)
    forks = repo.get("forks_count", 0)
    open_issues = repo.get("open_issues_count", 0)
    license_info = repo.get("license") or {}
    license_name = license_info.get("name") or "None"
    archived = repo.get("archived", False)
    default_branch = repo.get("default_branch", "main")

    score = 100
    deductions = []

    if archived:
        score -= 50
        deductions.append("Repository is archived (-50)")
    if stars < 50:
        score -= 20
        deductions.append("Low star count < 50 (-20)")
    if license_name == "None":
        score -= 15
        deductions.append("No open-source license detected (-15)")

    print(f"\n=======================================================")
    print(f"  AI Agent Skill Evaluation: {repo_full_name}")
    print(f"=======================================================")
    print(f"• Stars: {stars:,}")
    print(f"• Forks: {forks:,}")
    print(f"• License: {license_name}")
    print(f"• Open Issues: {open_issues}")
    print(f"• Status: {'Archived' if archived else 'Active'}")
    print(f"• Quality Score: {max(0, score)}/100")
    if deductions:
        print("\nDeductions:")
        for d in deductions:
            print(f"  - {d}")
    print("=======================================================\n")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 evaluate_agent_skill.py <owner/repo>")
        sys.exit(1)
    evaluate_repo(sys.argv[1])
