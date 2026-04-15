---
name: api-route-scaffold
description: Scaffold and update Next.js API routes with auth, validation, and response consistency. Use when adding or modifying endpoints under app/api/v1.
---

# API Route Scaffold

## Use when
- Adding a new route in `app/api/v1/**`.
- Refactoring an existing API route for safety or consistency.

## Workflow
1. Inspect nearby routes for naming and response conventions.
2. Add or reuse Zod validation from `lib/zod/**` for request inputs.
3. Apply auth early for protected routes using `createServerSupabaseClient`.
4. Implement data operations and side effects in explicit order.
5. Return consistent success and error JSON with proper status codes.
6. Verify route contract from caller perspective (shape, status, edge cases).

## Output checklist
- [ ] Auth requirement is explicit.
- [ ] Input validation is present.
- [ ] Error responses are consistent and user-safe.
- [ ] Side effects are deterministic and recoverable.
