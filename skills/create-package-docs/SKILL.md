# Skill: Create Package Documentation

Guide for setting up a new widget/component package with MyST Markdown documentation and a Curvenote project config.

---

## Package structure

Each package lives in its own subdirectory at the repo root:

```
<package-name>/
  curvenote.yml        # project metadata & site config
  index.md             # main documentation page (MyST)
  images/
    thumbnail.png      # 1200x630 thumbnail (see Thumbnail section)
  __resources/          # working folder — NOT shipped with the site
    index.md           # source article, reference notes, screenshots, etc.
  dist/
    <widget>.js        # built widget file(s)
```

The `_resources/` directory stays on disk but is excluded from the MyST build via `project.exclude` in `curvenote.yml`. It is a working space for source articles, reference notes, screenshots, and any other files used during package documentation creation.

---

## curvenote.yml

Full example from `bluesky/curvenote.yml`:

```yaml
version: 1
project:
  title: Bluesky Profile Card
  subtitle: A live Bluesky profile card widget for MyST Markdown and Curvenote
  description: One-sentence description for search/SEO.
  github: https://github.com/curvenote/dev.curvenote.components
  keywords:
    - bluesky
    - ui
    - profile
  thumbnail: images/thumbnail.png   # relative path to thumbnail image
  downloads:
    - url: dist/bluesky-profile-card.js
      title: bluesky-profile-card.js
  id: <uuid>            # MUST be a unique UUID v4 — generate one, never copy
  authors:
    - name: Steve Purves
      orcid: 0000-0002-0760-5497
      corresponding: true
      email: steve@curvenote.com
      affiliations:
        - curvenote
      url: https://curvenote.com
      github: stevejpurves
      bluesky: '@opensci.dev'
      linkedin: https://www.linkedin.com/in/stevejpurves/
      id: contributors-curvenote-generated-uid-0
  affiliations:
    - id: curvenote
      name: Curvenote
  exclude:
    - __resources/**     # working folder, not shipped
site:
  nav:
    - title: Article
      url: /_resources/index
  actions:
    - title: View on GitHub
      url: https://github.com/curvenote/dev.curvenote.components/tree/main/<package-name>
  domains:
    - stevejpurves.curve.space
```

### Critical: project.id must be a unique UUID

**Never copy the `id` from another package.** Generate a fresh UUID v4 for every new package:

```bash
python3 -c "import uuid; print(uuid.uuid4())"
# or
uuidgen | tr '[:upper:]' '[:lower:]'
```

---

## index.md frontmatter

```yaml
---
title: Widget Name
subtitle: One-line description
description: Slightly longer description for SEO/sharing.
---
```

---

## MyST nested directives — colon counting rule

Directives use `:::` fences. When nesting, each outer level needs **one more colon** than the level it wraps. Start from the innermost directive (3 colons) and count up:

| Nesting depth | Colons | Example |
|---|---|---|
| Innermost | `:::` (3) | `:::{any:bundle}` |
| One level up | `::::` (4) | `::::{grid-item}` |
| Two levels up | `:::::`  (5) | `:::::{grid}` |
| Three levels up | `::::::` (6) | `::::::{figure}` |

**Example — grid with widgets:**

```markdown
:::::{grid} 1 2 2 2
:gutter: 3

::::{grid-item}
:::{any:bundle} ./dist/my-widget.js
{ "prop": "value" }
:::
::::

::::{grid-item}
:::{any:bundle} ./dist/my-widget.js
{ "prop": "other" }
:::
::::

:::::
```

**Deeper nesting — grid → grid-item → figure → widget:**

```markdown
:::::::::{grid} 1 2 2 2
:gutter: 3

:::::::::{grid-item}
::::::::{figure}
:::::::{any:bundle} ./dist/my-widget.js
{ "prop": "value" }
:::::::
::::::::
:::::::::
```

The count from `_resources/index.md` in this repo uses 8 colons for `{grid}` because it wraps `{grid-item}` → `{figure}` → `{any:bundle}`.

---

## Using any:bundle directive

The `any:bundle` directive embeds an AnyWidget ESM module. The directive body is a JSON object of widget props.

```markdown
:::{any:bundle} https://curvenote.github.io/widgets/widgets/my-widget.js
{ "actor": "handle.bsky.social", "theme": "dark" }
:::
```

- During development, use the local path: `./dist/my-widget.js`
- In published articles / cross-repo references, use the CDN URL

---

## index.md structure

Suggested sections for the main documentation page:

1. **Intro paragraph** — what the widget does, key selling points
2. **Live demo** — grid of `any:bundle` examples using local `./dist/` path
3. **Installation** — how to obtain the JS file
4. **Usage** — minimal `any:bundle` code block
5. **Props table** — `| Field | Type | Default | Description |`
6. **Variant examples** — dark theme, no stats, non-clickable, etc.
7. **How it works** — brief technical explanation
8. **Accessibility / Browser support** — as relevant
9. **Source** — pointer to source file
10. **Further reading** — links to docs, protocols, related articles

---

## _resources/ — working folder (not shipped)

The `_resources/` directory is a working space for content that supports package creation but is **not part of the published site**. It is excluded via `project.exclude` in `curvenote.yml`.

Typical contents:
- Source articles or write-ups used as references
- Screenshots taken during development
- Notes, drafts, and research

Do **not** link to `_resources/` from `index.md` — those links will be broken in the built site. Do **not** add `_resources/` entries to `site.nav`.

---

## Thumbnail

Every package should have a thumbnail. It is used for social sharing cards, site preview tiles, and the Curvenote project listing. Set it in `curvenote.yml`:

```yaml
project:
  thumbnail: images/thumbnail.png
```

Recommended size: **1200 × 630 px** (standard Open Graph ratio). Store the file at `<package-name>/images/thumbnail.png`.

### Option 1 — screenshot from _resources/

Take a screenshot of the widget rendered in the browser (from the live `_resources/index.md` or `index.md` page). Crop to 1200 × 630, save to `images/thumbnail.png`.

### Option 2 — generated with a canvas / script

For widgets that are visually self-contained, write a small script that renders the widget to a canvas or uses a headless browser (e.g. Playwright) to capture a screenshot:

```bash
# quick playwright screenshot (requires @playwright/test installed)
npx playwright screenshot --browser chromium \
  http://localhost:3000 images/thumbnail.png \
  --viewport-size 1200,630
```

### Option 3 — generated image (no browser)

Use a simple Node or Python script to composite the widget preview onto a branded background, e.g. with `sharp`, `jimp`, or Pillow. Useful when the widget has a consistent visual signature.

### Fallback

If none of the above are done yet, commit a placeholder and file a follow-up. A missing thumbnail is better caught at review than silently omitted — add the `thumbnail` key to `curvenote.yml` pointing at the file path even before the image exists, so the gap is obvious.

---

## Checklist for a new package

- [ ] Create `<package-name>/` directory
- [ ] Generate a unique UUID v4 and set as `project.id` in `curvenote.yml`
- [ ] Fill in title, subtitle, description, keywords in `curvenote.yml`
- [ ] Set `downloads` entries for each distributable file
- [ ] Update `site.actions` GitHub URL to point to the new package subdirectory
- [ ] Set `site.domains` to the correct Curvenote domain
- [ ] Create `images/thumbnail.png` (1200 × 630) — screenshot, generated, or placeholder
- [ ] Set `project.thumbnail: images/thumbnail.png` in `curvenote.yml`
- [ ] Write `index.md` with frontmatter and all sections above
- [ ] Use correct colon counts for all nested directives
- [ ] Verify live demo blocks point to `./dist/<widget>.js`
- [ ] Add `project.exclude: [__resources/**]` to `curvenote.yml`
- [ ] Do NOT link to `_resources/` from `index.md` or add it to `site.nav`
