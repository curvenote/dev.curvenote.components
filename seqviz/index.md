---
title: SeqViz
subtitle: Interactive DNA sequence visualization
description: Embed SeqViz — circular and linear sequence maps with annotations, from file, Accession Number or JSON.
---

[SeqViz](https://github.com/Lattice-Automation/seqviz) is an open-source, embeddable library for interactive DNA sequence visualization and annotation on the web (@seqviz2020). It renders circular and linear maps, supports common formats via [seqparse](https://github.com/Lattice-Automation/seqparse) (@seqparse2022), and displays features, primers, and annotations with fast SVG/Canvas rendering.

This package gives you two ways to use it in MyST Markdown and Curvenote:

1. **`seqviz` directive** — use a file path or NCBI/iGEM accession ID; the directive and seqparse run at build time and pass the parsed data to the widget.
2. **Widget only** — use the `any:bundle` directive with a manually constructed JSON body when you don’t need build-time parsing.

The demos below show each option. The `seqviz` directive is enabled for this project via the plugin in `curvenote.yml`.

---

## Demo 1: By accession number

Render a sequence by **NCBI (or iGEM) accession ID**. Data is fetched and parsed at build time using [seqparse](https://github.com/Lattice-Automation/seqparse). Here we use **U49845**.

::::{figure}
:label: fig:seqviz-accession

:::{seqviz} U49845
:height: 500px
:viewer: both_flip
:::

Rendering **U49845** via the `seqviz` directive. Data is fetched from NCBI at build time.
::::

**Code:**

````{code} markdown
:::{seqviz} U49845
:height: 500px
:viewer: both_flip
:::
````

---

## Demo 2: By local file

Render a sequence from a **local GenBank (or FASTA, JBEI, SnapGene, SBOL) file**. The file is read and parsed at build time. This example uses the **AGTR2.gb** file included in this package.

::::{figure}
:label: fig:seqviz-file

:::{seqviz} ./AGTR2.gb
:height: 500px
:viewer: both
:::

Rendering **AGTR2.gb** (same locus as NM_000686) from a local file.
::::

**Code:**

````{code} markdown
:::{seqviz} ./AGTR2.gb
:height: 500px
:viewer: both
:::
````

---

## Demo 3: Widget only (manual JSON)

Use the widget **without** the directive or seqparse by passing sequence and annotations directly in the `any:bundle` body. No build-time parsing — useful when you already have JSON or don’t use seqparse.

::::{figure}
:label: fig:seqviz-widget-only

:::{any:bundle} https://curvenote.github.io/widgets/widgets/seqviz.js
{
  "height": "400px",
  "name": "J23100",
  "seq": "TTGACGGCTAGCTCAGTCCTAGGTACAGTGCTAGC",
  "annotations": [{ "name": "promoter", "start": 0, "end": 34, "direction": 1, "color": "blue" }],
  "viewer": "both_flip"
}
:::

Rendering a short sequence with a single annotation using only the widget.
::::

**Code:**

````{code} markdown
:::{any:bundle} https://curvenote.github.io/widgets/widgets/seqviz.js
{
  "height": "400px",
  "name": "J23100",
  "seq": "TTGACGGCTAGCTCAGTCCTAGGTACAGTGCTAGC",
  "annotations": [{ "name": "promoter", "start": 0, "end": 34, "direction": 1, "color": "blue" }],
  "viewer": "both_flip"
}
:::
````

Replace the URL with your hosted `seqviz.js` (e.g. `./dist/seqviz.js`) when not using the CDN.

---

## Installation

| File | Purpose |
|------|---------|
| `seqviz.js` | ESM widget module — host and reference in `any:bundle` (or use the CDN URL). |
| `directives/seqviz.mjs` | MyST plugin — register in your project (e.g. `plugins: [dist/directives/seqviz.mjs]` in `curvenote.yml`) so the `seqviz` directive and seqparse transform run. |

- **Directive (Demos 1 & 2):** Add the plugin to your build and ensure [seqparse](https://github.com/Lattice-Automation/seqparse) is available so the directive can parse files and accession IDs.
- **Widget only (Demo 3):** Host `seqviz.js` and use `any:bundle`; no plugin required.

:::{important}
The **seqparse** npm module must be available at build time in the folder you are building in for the `seqviz` directive (Demos 1 & 2) to work. It cannot be installed globally. Use one of these approaches:

1. **In your project folder:** run `npm init`, then `npm install seqparse`.
2. **Using the supplied package:** download the `package.json` from this package (e.g. from `dist/directives/` or the seqviz package root), place it in your build directory, then run `npm install`.
:::

---

## Props and options

### Widget / directive body

When using `any:bundle` or when the directive passes data to the widget:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `name` | `string` | — | Display name for the sequence |
| `seq` | `string` | — | Raw sequence (e.g. DNA). **Required** for widget-only usage. |
| `annotations` | `array` | `[]` | List of `{ name, start, end, direction?, color? }` |
| `height` | `string` | `"600px"` | Height of the visualization |
| `viewer` | `"linear"` \| `"circular"` \| `"both"` \| `"both_flip"` | `"both"` | Which view(s) to show |
| `class` | `string` | `""` | CSS/Tailwind classes for the container |
| `style` | `object` | `{}` | Inline style overrides |

### Directive options

For `:::{seqviz} path-or-accession`:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `height` | `string` | `"600px"` | Height of the visualization |
| `viewer` | `string` | `"both"` | `linear`, `circular`, `both`, or `both_flip` |
| `class` | `string` | `""` | Tailwind/CSS classes |
| `style` | `object` | `{}` | Style overrides |

The directive body can optionally override or extend parsed fields. See [seqparse](https://github.com/Lattice-Automation/seqparse) for supported formats and accession types.

---

## How it works

- **Widget:** The `seqviz.js` bundle is an AnyWidget ESM module. It receives a JSON object (`name`, `seq`, `annotations`, `viewer`, `height`, etc.) and renders the sequence view in the browser.
- **Directive:** The `seqviz` directive in `seqviz.mjs` produces a custom block that a **transform** (in the same plugin) resolves. The transform uses [seqparse](https://github.com/Lattice-Automation/seqparse) to read a local file or fetch by accession, then merges the result with any directive body and turns the block into an `any:bundle` call with `seqviz.js` and the merged JSON.

---

## Source

- Widget and directive: [dev.curvenote.components — seqviz](https://github.com/curvenote/dev.curvenote.components/tree/main/seqviz)
- SeqViz library: [Lattice-Automation/seqviz](https://github.com/Lattice-Automation/seqviz)
- seqparse (parsing): [Lattice-Automation/seqparse](https://github.com/Lattice-Automation/seqparse)

## Further reading

- [SeqViz (Lattice-Automation/seqviz)](https://github.com/Lattice-Automation/seqviz) — JavaScript DNA, RNA, and protein sequence viewer
- [SeqViz plugin article (opensci.dev)](https://opensci.dev/articles/seqviz-plugin) — context and examples for the directive
- [seqparse](https://github.com/Lattice-Automation/seqparse) — supported file formats and accession IDs
- [AnyWidget](https://anywidget.dev) — widget model used by this package
- [MyST Markdown widgets](https://mystmd.org/guide/interactive-notebooks)
