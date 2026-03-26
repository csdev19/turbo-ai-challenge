---
description: Structured thinking session — ask the right questions before building. Takes a rough idea, refines it through targeted dialogue, and produces a clear brief ready to act on.
allowed-tools: Read, Glob, Grep, Bash(git branch:*), Bash(date:*)
argument-hint: <your rough idea or what you're thinking about>
---

# Thinking

A structured pre-build session. The goal is to clarify what you actually want before writing a single line of code.

---

## Step 1: Load project context

Read these files to understand the current project state:

1. `CLAUDE.md` — stack, constraints, product vision
2. `.claude/skills/feature-docs/AGENT.md` — existing decisions, known gotchas, project map

Also run:

```bash
git branch --show-current
```

Do NOT read unrelated feature docs. Only load what's needed to understand the project context.

---

## Step 2: Parse the rough idea

The user's input is: **$ARGUMENTS**

Extract from it:

- **Core intent** — what outcome does the user want?
- **Scope signals** — what files, features, or areas are likely touched?
- **Open questions** — what is ambiguous, missing, or risky?

---

## Step 3: Ask clarifying questions

Based on the rough idea and project context, identify the 3–5 most important things to clarify before building.

**Question selection rules:**

- Ask about **decisions that are hard to reverse** (data model, API shape, UX flow)
- Ask about **scope** — what's in, what's explicitly out for this session
- Ask about **user-facing behavior** — what does the user see / feel / do?
- Ask about **known unknowns** — anything in the rough idea that is vague or contradictory
- Skip questions whose answers are already obvious from CLAUDE.md or AGENT.md

**Format for the questions:**

---

**Before we build, let me ask a few things:**

1. **[Category]** — question text?

   > _Why this matters: one sentence on the consequence of getting it wrong._

2. **[Category]** — question text?
   > _Why this matters: ..._

(continue for 3–5 questions max)

---

Take the user's answers, then proceed to Step 4.

---

## Step 4: Synthesize a thinking brief

After the user answers, produce a structured brief:

```
THINKING BRIEF
---
Date: {today}
Idea: {one-line summary of the original input}

What we're building:
  {2-3 sentences — clear scope, what it does, what it doesn't do}

Key decisions:
  - {Decision 1}: {chosen direction} — because {reason}
  - {Decision 2}: ...

Out of scope (this session):
  - {what is explicitly deferred or excluded}

Risks / unknowns:
  - {anything still unclear or potentially tricky}

First concrete step:
  {the single most important thing to do first}

Connects to existing work:
  {any related features, files, or decisions already in the project}
```

---

## Step 5: Offer next steps

Ask the user which direction to take:

---

**Brief ready. What's next?**

- **A) Start building** — I'll implement the first step directly
- **B) Save as a plan** — I'll write this brief to `docs/plans/{feature-name}.mdx` for reference
- **C) Go deeper** — I'll ask a second round of questions on a specific aspect
- **D) Nothing yet** — just thinking for now

---

Wait for the user's choice and act on it.

## IMPORTANT RULES

- **NEVER commit code** after building. Only write code and leave changes uncommitted. The user will explicitly ask to commit when ready.
- This skill is for thinking and building only — committing is a separate step the user controls.
