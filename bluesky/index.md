---
title: Bluesky Profile Card
subtitle: A live Bluesky profile card widget for MyST Markdown and Curvenote
description: An AnyWidget ESM module that fetches and renders a Bluesky profile card directly from the AT Protocol public API — no build step, no API key required.
---

Embed a live, interactive Bluesky profile card anywhere in a MyST Markdown document or Curvenote article. The widget fetches directly from the [AT Protocol](https://atproto.com) public API in the browser at render time — no bundler, no API key, no server required.

:::::{grid} 1 2 2 2
:gutter: 3

::::{grid-item}
:::{any:bundle} https://curvenote.github.io/widgets/widgets/bluesky-profile-card.js
{ "actor": "opensci.dev", "show_stats": true }
:::
::::

::::{grid-item}
:::{any:bundle} https://curvenote.github.io/widgets/widgets/bluesky-profile-card.js
{ "actor": "curvenote.com", "show_stats": true }
:::
::::

::::{grid-item}
:::{any:bundle} https://curvenote.github.io/widgets/widgets/bluesky-profile-card.js
{ "actor": "mystmd.org", "show_stats": true }
:::
::::

::::{grid-item}
:::{any:bundle} https://curvenote.github.io/widgets/widgets/bluesky-profile-card.js
{ "actor": "row1.ca", "theme": "dark" }
:::
::::

:::::

## Installation

Download `bluesky-profile-card.js` and host it anywhere that can serve static files (a MyST site's `public/` folder, a CDN, GitHub Pages). Then reference it by URL in the `any:bundle` directive.

## Usage

Add a profile card to any MyST document with the `any:bundle` directive:

````{code} markdown
:::{any:bundle} https://example.com/bluesky-profile-card.js
{ "actor": "your-handle.bsky.social" }
:::
````

The directive body is a JSON object. Only `actor` is required:

| Field | Type | Default | Description |
|---|---|---|---|
| `actor` | `string` | — | Bluesky handle (e.g. `"opensci.dev"`) or DID (**required**) |
| `show_stats` | `boolean` | `true` | Display followers / following / post counts |
| `theme` | `"light"` \| `"dark"` | `"light"` | Card colour scheme |
| `link_target` | `boolean` | `true` | Make the entire card a clickable link to the Bluesky profile |

### Minimal example

````{code} markdown
:::{any:bundle} https://example.com/bluesky-profile-card.js
{ "actor": "mystmd.org" }
:::
````

### Dark theme, stats hidden

::::{grid} 1 1 1 1

:::{any:bundle} https://curvenote.github.io/widgets/widgets/bluesky-profile-card.js
{ "actor": "opensci.dev", "theme": "dark", "show_stats": false }
:::

::::

````{code} markdown
:::{any:bundle} https://example.com/bluesky-profile-card.js
{ "actor": "opensci.dev", "theme": "dark", "show_stats": false }
:::
````

### Non-clickable card (embed only)

````{code} markdown
:::{any:bundle} https://example.com/bluesky-profile-card.js
{ "actor": "opensci.dev", "link_target": false }
:::
````

## How it works

The widget is a plain ESM module (`type: module`). When rendered, it:

1. Shows an animated skeleton placeholder immediately.
2. Calls `https://api.bsky.app/xrpc/app.bsky.actor.getProfile` — a fully public endpoint, no authentication needed.
3. Replaces the skeleton with the rendered card, or an error state if the handle could not be resolved.

All network calls happen in the reader's browser. There is no proxy, no backend, and no credentials involved.

## Accessibility

When `link_target` is `true` the card element receives `role="link"` and `tabindex="0"` and responds to the Enter key, making it keyboard-navigable. The "View on Bluesky" footer link is always present and independently focusable regardless of the `link_target` setting.

## Browser support

Any browser with native ES module support (all modern browsers). No polyfills are required.

## Source

The widget source lives in `dist/bluesky-profile-card.js` and has no runtime dependencies. It uses the browser-native `fetch` API and plain DOM manipulation.

## Further reading

- [AnyWidget documentation](https://anywidget.dev)
- [MyST Markdown widgets guide](https://mystmd.org/guide/interactive-notebooks)
- [AT Protocol public API](https://docs.bsky.app/docs/api/app-bsky-actor-get-profile)

---
