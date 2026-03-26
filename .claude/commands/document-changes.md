---
description: Analyze session changes, classify them across documentation areas, preview the plan, then write all docs. Covers features (domain/business), architecture (frontend + backend + decisions), plans, and changelog.
allowed-tools: Read, Edit, Write, Glob, Grep, Bash(git log:*), Bash(git diff:*), Bash(git branch:*), Bash(git status:*), Bash(ls:*), Bash(find:*), Bash(date:*)
argument-hint: [optional: brief session description]
---

# Document Changes

## Step 1: Load configuration and agent memory

Read both files before doing anything else:

1. `.claude/skills/feature-docs/SKILL.md` — get `DOCS_BASE`, `DOCS_EXT`, `INDEX_FILE`, `USES_FRONTMATTER`, and all templates
2. `.claude/skills/feature-docs/AGENT.md` — load agent memory: project map, domain vocabulary, recent decisions, known gotchas

If `AGENT.md` doesn't exist yet, create it using the **Agent Memory Template** from `SKILL.md` with empty sections, then continue.

Also read `.claude/skills/feature-docs/classifier.md` — classification rules and routing logic.

---

## Step 2: Scan changes from the session

This command runs **before committing** — the primary source of truth is the working tree, not git history.

Run the following to gather raw evidence:

```bash
# 1. Working tree state — staged + unstaged + untracked (PRIMARY SOURCE)
git status --short

# 2. Staged changes (ready to commit)
git diff --name-only --cached

# 3. Unstaged changes (modified but not yet staged)
git diff --name-only

# 4. Summary stat of all uncommitted changes
git diff --stat HEAD 2>/dev/null

# 5. Recent commit messages for project context only (not the changes to document)
git log --oneline -5 2>/dev/null

# 6. Current branch name
git branch --show-current 2>/dev/null
```

**Source priority:**

1. Conversation context (this session's implementation details, decisions, gotchas) — most valuable
2. `$ARGUMENTS` if provided — developer's own description, weight heavily
3. Working tree files (staged + unstaged + untracked from `git status`)
4. Git history — only for project context, NOT as the primary change set

Do NOT treat committed history (`main...HEAD`) as the session's changes. The changes to document are what hasn't been saved yet.

If the session context (conversation history) contains implementation details, decisions, or gotchas — extract and record them now. They are more valuable than git diffs alone.

---

## Step 3: Classify changes

Read the full rules in `.claude/skills/feature-docs/classifier.md`.

For each changed file or logical group of changes, assign it to one or more documentation areas:

| Area            | Folder                   | Trigger signals                                                           |
| --------------- | ------------------------ | ------------------------------------------------------------------------- |
| Business/Domain | `features/`              | Domain entities, use cases, business rules, emotion tracking, AI analysis |
| Backend         | `architecture/backend/`  | Convex functions, schema changes, server actions, cron jobs               |
| Frontend        | `architecture/frontend/` | React components, hooks, UI library, routing, TanStack, client-side state |
| Architecture    | `architecture/`          | Monorepo structure, cross-app decisions, deployment topology, tooling     |
| Plans           | `plans/`                 | Implementation plans, status tracking                                     |

A single session can produce docs in **multiple areas**. This is expected and correct.

For each area triggered, determine:

- **Is this a new topic or an update to an existing doc?**
- **What is the parent folder / document name?**
- **What sub-feature or section name applies?**

Cross-reference `AGENT.md`'s project map to avoid duplicating existing docs — update them instead.

---

## Step 4: Compact the session into a summary

Before building the preview, synthesize a compact internal summary:

```
SESSION SUMMARY
---
Branch: {branch-name}
Date: {today}
Developer note: {$ARGUMENTS or "none provided"}

Changes detected:
  {list of changed files grouped by type}

What was done:
  {1-3 sentence description of the work, extracted from context + diffs}

Key decisions made:
  {bullet list — what was chosen and why, if known}

Gotchas found:
  {anything unexpected, tricky, or worth warning the next dev about}

Dependencies introduced:
  {new packages, services, or APIs, if any}

Classification result:
  features/                -> {list of domain topics touched, or "none"}
  architecture/backend/    -> {list of backend topics, or "none"}
  architecture/frontend/   -> {list of frontend topics, or "none"}
  architecture/ (top-level) -> {list of architecture decisions, or "none"}
  plans/                   -> {list of plan updates, or "none"}
```

Do not write any files yet.

---

## Step 5: Show preview and require confirmation

Present the full documentation plan to the user. **Nothing is written until the user confirms.**

Wait for the user's response. Do not proceed until you receive explicit confirmation.

If the user requests changes to the plan, apply them, show the updated preview again, and wait for confirmation again. Repeat until confirmed.

---

## Step 6: Write all documentation files

Only after confirmed — write all files from the approved plan using the templates from SKILL.md.

---

## Step 7: Update changelog

File: `{DOCS_BASE}/changelog/{INDEX_FILE}`

If the file doesn't exist, create it with the changelog header template.

Prepend a new date-section entry after the `# Changelog` heading (newest first):

```markdown
## {YYYY-MM-DD} — {Short title}

**Phase:** {Phase name}

- {Change 1}
- {Change 2}

**Docs:** [doc-name]({relative link}), [doc-name]({relative link})

---
```

---

## Step 8: Update AGENT.md memory

Update `.claude/skills/feature-docs/AGENT.md`:

1. **Project Map** — add or update entries for every file created/updated today
2. **Recent Decisions** — prepend the top 1-3 decisions from this session (keep max 15 total, drop oldest)
3. **Domain Vocabulary** — add any new project-specific terms encountered
4. **Known Gotchas** — add any gotchas documented in this session (deduplicate)
5. **Last Updated** — set to today's date

---

## Step 9: Summary report

Show the user:

- Files created and updated
- Changelog entry added
- Agent memory updates

Ask: "Want me to commit these documentation changes?"
