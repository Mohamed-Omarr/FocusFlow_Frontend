---
name: i18n-key-sync
description: Keep translation keys synchronized across locales for next-intl. Use when adding or changing user-facing copy in localized routes or components.
---

# i18n Key Sync

## Use when
- Adding new UI text in localized screens.
- Renaming, moving, or removing translation keys.

## Workflow
1. Add key(s) in `messages/en.json` using existing hierarchy.
2. Mirror the same key path in `messages/tr.json` and `messages/ar.json`.
3. Wire the key in components and avoid hardcoded localized strings.
4. Validate that all locales resolve without missing-key runtime errors.
5. If translation is pending, use a clear placeholder and note follow-up.

## Output checklist
- [ ] Key paths are identical in all locales.
- [ ] New copy is referenced via translation APIs.
- [ ] No accidental key churn or broad key renames.
