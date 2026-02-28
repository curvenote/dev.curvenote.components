---
title: "Embed a live Bluesky profile card with AnyWidget"
date: 2026-02-20
---

We have been spending time lately exploring [Bluesky](https://bsky.app) and the [AT Protocol](https://atproto.com) that powers it. There is something genuinely exciting about a social network built on an open protocol where public data is actually, properly public — no API keys, no rate-limited developer tiers, just a clean HTTP endpoint anyone can call. That philosophy of openness feels important, and we are keen to see where it goes.

While poking around the APIs, we built a small [AnyWidget](https://anywidget.dev) as a way to play with the data — a live profile card that fetches directly from the AT Protocol public API in the browser and renders inline in any MyST article or Curvenote document. If you missed it, we recently wrote about [how AnyWidgets are being upstreamed into MyST core](https://opensci.dev/articles/upstream-anywidget-into-myst-core) and are already available in Curvenote today.

::::::::{grid} 1 2 2 2
:gutter: 3

:::::::{grid-item}
::::::{figure}
:::::{any:bundle} https://curvenote.github.io/widgets/widgets/bluesky-profile-card.js
{ "actor": "opensci.dev", "show_stats": true, "link_target": true }
:::::
::::::
:::::::

:::::::{grid-item}
::::::{figure}
:::::{any:bundle} https://curvenote.github.io/widgets/widgets/bluesky-profile-card.js
{ "actor": "row1.ca", "show_stats": true, "link_target": true }
:::::
::::::
:::::::

:::::::{grid-item}
::::::{figure}
:::::{any:bundle} https://curvenote.github.io/widgets/widgets/bluesky-profile-card.js
{ "actor": "curvenote.com", "show_stats": true, "link_target": true }
:::::
::::::
:::::::

:::::::{grid-item}
::::::{figure}
:::::{any:bundle} https://curvenote.github.io/widgets/widgets/bluesky-profile-card.js
{ "actor": "mystmd.org", "show_stats": true, "link_target": true }
:::::
::::::
:::::::

::::::::

## Using it in your own documents

Drop the `any:bundle` directive into any MyST Markdown file and point it at your handle:

````{code} markdown
:::{any:bundle} https://curvenote.github.io/widgets/widgets/bluesky-profile-card.js
{ "actor": "your-handle.bsky.social" }
:::
````

The body is a small JSON object with four optional fields:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `actor` | string | — | Bluesky handle or DID (**required**) |
| `show_stats` | boolean | `true` | Show followers / following / post counts |
| `theme` | `"light"` \| `"dark"` | `"light"` | Card colour scheme |
| `link_target` | boolean | `true` | Make the card clickable, opening the profile on https://bsky.app |

The widget is a plain ESM module — no bundler, no build step, no server. It fetches the profile at render time from `api.bsky.app` and works in any browser that supports ES modules.

---

We are only just getting started with what the AT Protocol makes possible. The data model is rich, the community is active, and there is real momentum behind the idea that social content should be portable and open. Expect more experiments here. In the meantime, come find us on Bluesky at [\@opensci.dev](https://bsky.app/profile/opensci.dev) and [\@row1.ca](https://bsky.app/profile/row1.ca).
