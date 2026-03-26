---
paths: [apps/*/src/server-functions/**]
---

When writing or modifying server functions, check if relevant backend docs exist
at `apps/documentation/src/content/docs/backend/` for response and error patterns.

Key docs to consider:

- `backend/api-response-types.mdx` — Standard response type patterns
- `backend/result-types.mdx` — Result<T, E> pattern for error handling
- `backend/response-helpers.mdx` — Helper functions for building responses
- `backend/error-handlers.mdx` — Error handling conventions

Only read docs relevant to the specific change being made.
