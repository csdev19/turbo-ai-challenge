---
paths: [packages/**/*.ts]
---

When modifying code in `packages/`, check if relevant architecture docs exist
at `apps/documentation/src/content/docs/architecture/` before making structural decisions.

Key docs to consider:

- `architecture/application-layer.mdx` — Layer-first structure and use case patterns
- `architecture/repository-pattern.mdx` — Repository interface/implementation split
- `architecture/constants-pattern.mdx` — `as const` pattern for enum-like values
- `architecture/infrastructure-naming.mdx` — `infra-*` naming convention
- `architecture/schemas-implementation.mdx` — Zod schema patterns across layers
- `architecture/domain-architecture-patterns.mdx` — DDD vs Schema-Based decisions

Only read docs relevant to the specific change being made.
