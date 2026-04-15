---
name: feature-slice-builder
description: Build end-to-end feature slices across UI, API, validation, and i18n with minimal regressions. Use when a task spans multiple layers of the app.
---

# Feature Slice Builder

## Use when
- Implementing features that touch route UI, state/query, API, and schema.
- Breaking large requests into incremental, testable slices.

## Workflow
1. Define scope boundaries (UI entrypoint, API route, schema, locale keys).
2. Implement data contract first (types and validation).
3. Wire API call/query key and loading/error states.
4. Update UI components with focused, composable changes.
5. Add or update message keys for user-facing strings.
6. Run a quick manual walkthrough of key user paths.

## Slice checklist
- [ ] Types and schema align with payload shape.
- [ ] UI handles loading, empty, success, and error states.
- [ ] API and i18n updates are included in same slice.
