---
name: quality-gate-before-commit
description: Run a practical quality gate before finalizing substantial changes. Use when preparing to hand off or commit code.
---

# Quality Gate Before Commit

## Use when
- Finishing a multi-file or behavior-changing task.
- Preparing a final validation pass before commit/PR.

## Workflow
1. Review changed files for scope creep and accidental edits.
2. Run available checks (`lint`, type checks, targeted tests) as appropriate.
3. Re-check high-risk areas: auth guards, API status codes, i18n key parity.
4. Ensure error and empty states are handled in user-facing flows.
5. Summarize residual risks and recommended follow-up checks.

## Output checklist
- [ ] Checks run (or clearly noted why skipped).
- [ ] No generated/build artifacts included unintentionally.
- [ ] Residual risks are called out clearly.
