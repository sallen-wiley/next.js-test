// ArticleCardFigmaToMUI.md

# Figma Node to MUI Component Mapping for Article Card

## Header (Title & IconButton)

- **Figma:** `.article card header` layer containing:
  - Typography (Open Sans, Bold, 24px)
  - IconButton (e.g., MoreVert)
- **MUI:**
  - `Typography` with `variant="h5"` and `fontWeight={700}` (for title)
  - `IconButton` (for actions, e.g., `MoreVertIcon`)

## Metadata Row (Category Chip, Star Icon)

- **Figma:** Chip, IconButton, Icons
- **MUI:**
  - `Chip` (for category label)
  - `IconButton` (for star/favorite action, e.g., `StarBorderIcon`)

## Divider

- **Figma:** Horizontal line/divider
- **MUI:** `Divider`

## Description

- **Figma:** Typography (Open Sans, Regular, 14px)
- **MUI:** `Typography` with `variant="body2"`

## Metadata Key-Value Row (Author, Date)

- **Figma:** Typography (Regular and Bold for values)
- **MUI:** `Typography` with `variant="body2"` and `fontWeight={700}` for values

## Card Container

- **Figma:** Card background, padding, border radius
- **MUI:** `Card`, `CardContent`, `CardActions`

---

This mapping uses only default MUI components and icons, matching the Figma node structure as closely as possible without custom styling. The header section now correctly groups the title and IconButton together, as in the Figma design.
