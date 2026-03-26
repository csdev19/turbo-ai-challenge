---
paths: [packages/**/*.ts, apps/**/*.ts]
---

Before modifying an existing feature, check if a matching feature doc folder exists.

1. Check if `apps/documentation/src/content/docs/features/{feature-name}/` exists
2. If it does:
   - Read `features/{feature-name}/index.mdx` for architecture overview and shared decisions
   - If working on a specific sub-feature, read that sub-feature's doc (`.mdx`)
   - Respect any gotchas or decisions documented there
3. Do NOT read unrelated sub-feature docs. Only read the index + the specific sub-feature you need.
