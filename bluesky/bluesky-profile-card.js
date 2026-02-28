/**
 * Bluesky Profile Card — AnyWidget ESM Module
 * No framework, no bundler. Plain DOM + fetch.
 *
 * Model fields:
 *   actor       (string)  handle or DID, e.g. "opensci.dev"        [required]
 *   show_stats  (bool)    show followers/following/posts counts     [default: true]
 *   theme       (string)  "light" | "dark"                         [default: "light"]
 *   link_target (bool)    make card clickable → opens bsky profile  [default: true]
 */

// ─── Bluesky API ──────────────────────────────────────────────────────────────

async function fetchProfile(actor) {
  const url = `https://api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(actor)}`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || res.statusText);
  }
  return res.json();
}

function fmt(n) {
  if (n == null) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

// ─── Minimal DOM helper ───────────────────────────────────────────────────────

function h(tag, attrs, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === "class")    node.className = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const child of children.flat()) {
    if (child == null) continue;
    node.append(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return node;
}

// ─── SVG icon ─────────────────────────────────────────────────────────────────

// Official Bluesky logomark from github.com/bluesky-social/social-app
const BSKY_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0">
  <path d="M6.335 4.212c2.293 1.76 4.76 5.327 5.665 7.241.906-1.914 3.372-5.482 5.665-7.241C19.319 2.942 22 1.96 22 5.086c0 .624-.35 5.244-.556 5.994-.713 2.608-3.315 3.273-5.629 2.87 4.045.704 5.074 3.035 2.852 5.366-4.22 4.426-6.066-1.111-6.54-2.53-.086-.26-.126-.382-.127-.278 0-.104-.041.018-.128.278-.473 1.419-2.318 6.956-6.539 2.53-2.222-2.331-1.193-4.662 2.852-5.366-2.314.403-4.916-.262-5.63-2.87C2.35 10.33 2 5.71 2 5.086c0-3.126 2.68-2.144 4.335-.874Z"/>
</svg>`;

// ─── Card builders ────────────────────────────────────────────────────────────

function buildSkeleton(dark) {
  return h("div", { class: `bpc-card ${dark ? "bpc-dark" : "bpc-light"}` },
    h("div", { class: "bpc-banner bpc-banner-placeholder" }),
    h("div", { class: "bpc-body" },
      h("div", { class: "bpc-avatar-wrap" },
        h("div", { class: "bpc-avatar bpc-skel" })
      ),
      h("div", { class: "bpc-skel bpc-skel-name" }),
      h("div", { class: "bpc-skel bpc-skel-handle" }),
      h("div", { class: "bpc-skel bpc-skel-bio" }),
      h("div", { class: "bpc-skel bpc-skel-bio", style: "width:55%" }),
    )
  );
}

function buildError(actor, msg, dark) {
  return h("div", { class: `bpc-card ${dark ? "bpc-dark" : "bpc-light"}` },
    h("div", { class: "bpc-error-inner" },
      h("span", {}, "⚠"),
      h("span", {}, `Failed to load @${actor}: `, h("em", {}, msg))
    )
  );
}

function buildCard(profile, { showStats, dark, linkTarget }) {
  const profileUrl = `https://bsky.app/profile/${profile.handle}`;

  // Banner
  const banner = h("div", {
    class: `bpc-banner${profile.banner ? "" : " bpc-banner-placeholder"}`,
  });
  if (profile.banner) {
    banner.append(h("img", { class: "bpc-banner-img", src: profile.banner, alt: "" }));
  }

  // Avatar
  const avatar = profile.avatar
    ? h("img", { class: "bpc-avatar", src: profile.avatar, alt: profile.displayName || profile.handle })
    : h("div", { class: "bpc-avatar bpc-avatar-fallback" },
        (profile.displayName || profile.handle || "?")[0].toUpperCase()
      );

  // Stats
  const stats = showStats
    ? h("div", { class: "bpc-stats" },
        ...[
          [fmt(profile.followersCount), "Followers"],
          [fmt(profile.followsCount),   "Following"],
          [fmt(profile.postsCount),     "Posts"],
        ].map(([num, label]) =>
          h("div", { class: "bpc-stat" },
            h("span", { class: "bpc-stat-num" }, num),
            h("span", { class: "bpc-stat-label" }, label)
          )
        )
      )
    : null;

  // Footer link — always present, stops click propagation if card is clickable
  const footerLink = h("a", {
    class: "bpc-bsky-link",
    href: profileUrl,
    target: "_blank",
    rel: "noopener noreferrer",
    html: `${BSKY_ICON} View on Bluesky`,
    click: (e) => e.stopPropagation(),
  });

  const body = h("div", { class: "bpc-body" },
    h("div", { class: "bpc-avatar-wrap" }, avatar),
    h("div", { class: "bpc-names" },
      h("div", { class: "bpc-display-name" }, profile.displayName || profile.handle),
      h("div", { class: "bpc-handle" }, `@${profile.handle}`)
    ),
    profile.description ? h("p", { class: "bpc-bio" }, profile.description) : null,
    stats,
    h("div", { class: "bpc-footer" }, footerLink)
  );

  const card = h("div", {
    class: `bpc-card ${dark ? "bpc-dark" : "bpc-light"}${linkTarget ? " bpc-clickable" : ""}`,
  }, banner, body);

  if (linkTarget) {
    card.addEventListener("click", () => window.open(profileUrl, "_blank", "noopener"));
    card.setAttribute("role", "link");
    card.setAttribute("tabindex", "0");
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter") window.open(profileUrl, "_blank", "noopener");
    });
  }

  return card;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const CSS = `
.bpc-card {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  border-radius: 16px;
  overflow: hidden;
  max-width: 420px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  transition: box-shadow 0.2s ease, transform 0.15s ease;
}
.bpc-light {
  background: #ffffff;
  color: #0f1419;
  border: 1px solid #e1e8ed;
}
.bpc-dark {
  background: #16202a;
  color: #e7e9ea;
  border: 1px solid #2f3336;
}
.bpc-clickable { cursor: pointer; }
.bpc-clickable:hover {
  box-shadow: 0 6px 28px rgba(0,0,0,0.14);
  transform: translateY(-1px);
}
.bpc-clickable:active { transform: translateY(0); }

/* Banner */
.bpc-banner { width: 100%; height: 120px; overflow: hidden; }
.bpc-banner-placeholder {
  background: linear-gradient(135deg, #0085ff 0%, #0060c4 50%, #6a00f4 100%);
}
.bpc-banner-img { width: 100%; height: 100%; object-fit: cover; display: block; }

/* Body */
.bpc-body { padding: 0 16px 14px; }

/* Avatar */
.bpc-avatar-wrap { margin-top: -36px; margin-bottom: 10px; display: inline-block; }
.bpc-avatar {
  width: 72px; height: 72px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  border: 3px solid #ffffff;
  box-shadow: 0 1px 6px rgba(0,0,0,0.15);
}
.bpc-dark .bpc-avatar { border-color: #16202a; }
.bpc-avatar-fallback {
  width: 72px; height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0085ff, #6a00f4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 28px;
  font-weight: 700;
  border: 3px solid #ffffff;
  box-shadow: 0 1px 6px rgba(0,0,0,0.15);
}
.bpc-dark .bpc-avatar-fallback { border-color: #16202a; }

/* Names */
.bpc-names { margin-bottom: 8px; }
.bpc-display-name { font-size: 18px; font-weight: 800; line-height: 1.2; letter-spacing: -0.01em; }
.bpc-handle { font-size: 14px; color: #536471; margin-top: 2px; }
.bpc-dark .bpc-handle { color: #8b98a5; }

/* Bio */
.bpc-bio { font-size: 14px; line-height: 1.55; margin: 0 0 12px; white-space: pre-wrap; word-break: break-word; }

/* Stats */
.bpc-stats { display: flex; gap: 16px; margin-bottom: 12px; flex-wrap: wrap; }
.bpc-stat { display: flex; align-items: baseline; gap: 4px; }
.bpc-stat-num { font-size: 15px; font-weight: 700; }
.bpc-stat-label { font-size: 13px; color: #536471; }
.bpc-dark .bpc-stat-label { color: #8b98a5; }

/* Footer */
.bpc-footer { display: flex; justify-content: flex-end; margin-top: 4px; }
.bpc-bsky-link {
  font-size: 12px; color: #0085ff; text-decoration: none;
  display: inline-flex; align-items: center; gap: 5px;
  opacity: 0.7; transition: opacity 0.15s;
}
.bpc-bsky-link:hover { opacity: 1; text-decoration: underline; }

/* Error */
.bpc-error-inner {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 20px 16px; font-size: 13px; line-height: 1.5; color: #e0245e;
}
.bpc-dark .bpc-error-inner { color: #f4616e; }

/* Skeleton shimmer */
.bpc-skel {
  background: linear-gradient(90deg, #ebebeb 25%, #f5f5f5 50%, #ebebeb 75%);
  background-size: 200% 100%;
  animation: bpc-shimmer 1.4s infinite;
  border-radius: 6px;
}
.bpc-dark .bpc-skel {
  background: linear-gradient(90deg, #1e2c3a 25%, #263342 50%, #1e2c3a 75%);
  background-size: 200% 100%;
}
@keyframes bpc-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.bpc-skel-name   { height: 20px; width: 55%; margin-bottom: 8px; }
.bpc-skel-handle { height: 14px; width: 35%; margin-bottom: 14px; }
.bpc-skel-bio    { height: 13px; width: 90%; margin-bottom: 6px; }
`;

function injectStyles() {
  const id = "bpc-styles-v1";
  if (!document.getElementById(id)) {
    const style = document.createElement("style");
    style.id = id;
    style.textContent = CSS;
    document.head.appendChild(style);
  }
}

// ─── AnyWidget export ─────────────────────────────────────────────────────────

export default {
  async render({ model, el }) {
    injectStyles();

    let currentCard = null;

    async function update() {
      const actor     = model.get("actor");
      const showStats = model.get("show_stats") ?? true;
      const dark      = model.get("theme") === "dark";
      const linkTarget = model.get("link_target") ?? true;

      // Show skeleton while loading
      const skeleton = buildSkeleton(dark);
      el.replaceChildren(skeleton);
      currentCard = skeleton;

      let card;
      try {
        const profile = await fetchProfile(actor);
        card = buildCard(profile, { showStats, dark, linkTarget });
      } catch (err) {
        card = buildError(actor, err.message, dark);
      }

      // Only update if this is still the latest render (actor may have changed)
      if (el.contains(skeleton)) {
        el.replaceChildren(card);
        currentCard = card;
      }
    }

    await update();

    model.on("change:actor",       update);
    model.on("change:show_stats",  update);
    model.on("change:theme",       update);
    model.on("change:link_target", update);
  },
};
