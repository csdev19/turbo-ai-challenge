---
paths: [apps/*/src/routes/**, apps/*/src/components/**]
---

When writing or modifying routes and components, check if relevant frontend docs exist
at `apps/documentation/src/content/docs/frontend/` for data loading and UI patterns.

Key docs to consider:

- `frontend/data-loading.mdx` — TanStack Router + Query data loading patterns
- `frontend/web-ui-package.mdx` — @rakoi/web-ui component library guide
- `frontend/mobile-app.mdx` — Mobile app structure and constraints

Only read docs relevant to the specific change being made.
