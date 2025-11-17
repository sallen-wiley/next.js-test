# Field Assumptions

## Approved

1. Fields can have from 0 to many badges (icons) on the top line
2. Field icons are cosmetic, affordance-only, not interactive
3. Icons themselves should signal field criteria, with popover info if hover
4. All fields should have object titles
5. Only use placeholders for examples (dates, emails, DOI) or delayed interaction (after typing threshold)
6. Placeholders should look different from user text (italic, less contrast)
7. List fields should also have object titles

## To review

1. Hybrid mode policy: non-MUI products install MUI silently, and “flip” components to MUI version as they touch code
2. Do MUI field titles pass screenreader accessibility rules? (Accessibility check needed)
3. Discuss pass/fail badge (inline validation, min-max)
4. Discuss info/alert icon mismatch
5. Discuss hit targets and popover on tap, in touch screens (WCAG 2.5.5 for Better Target Sizes)
6. Placeholders and screen reader accessibility
