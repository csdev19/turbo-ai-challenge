# Development Workflow

## Phases

### 1. Thinking

Analyze the problem before writing any code. Understand requirements, review Figma designs, identify constraints, and clarify unknowns with the team.

- What does the user need?
- What does the Figma spec say? (fonts, colors, sizes, spacing)
- What already exists that can be reused?
- What are the edge cases?

### 2. Plan

Define the implementation approach. Break work into discrete tasks, identify dependencies, and decide on the order of execution.

- List the tasks needed
- Identify what can be done in parallel
- Choose the right tools and patterns
- Flag risks or blockers early

### 3. Execute

Build it. Follow the plan, match specs exactly, and verify as you go.

- Implement backend changes first (models, API)
- Build frontend to consume the API
- Match Figma specs pixel-by-pixel (colors, fonts, spacing)
- Run builds to catch errors early
- Test the full flow end-to-end

### 4. Document

Capture what was built, why, and how to use it. Do this while context is fresh.

- Update README with setup instructions
- Write feature docs (what it does, key decisions, gotchas)
- Write architecture docs (structure, data flow, patterns)
- Keep env examples up to date

### 5. Commit

Save the work with clear, descriptive commit messages.

- Review all changes before committing
- Group related changes into logical commits
- Write commit messages that explain the "why"
- Never commit secrets or env files
