---
name: supabase-session-safe-changes
description: Safely modify Supabase-backed auth and session flows in Next.js SSR context. Use when changing login, profile, account, or user-scoped route behavior.
---

# Supabase Session Safe Changes

## Use when
- Editing auth routes or protected user endpoints.
- Updating profile/account actions that rely on current session.

## Workflow
1. Confirm whether logic runs on server route, action, or client boundary.
2. Use the established server client pattern from `lib/supabase/server.ts`.
3. Check auth user retrieval and unauthorized handling paths first.
4. Keep cookie/session assumptions explicit when changing session behavior.
5. Ensure response messages and statuses do not leak sensitive details.
6. Verify flows for authenticated and unauthenticated users.

## Output checklist
- [ ] Unauthorized path is explicit and consistent.
- [ ] Session retrieval pattern matches project conventions.
- [ ] Changes do not break cookie-based SSR expectations.
