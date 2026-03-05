---
title: Vizarr Viewer
subtitle: OME-Zarr microscopy viewer for MyST Markdown and Curvenote
description: Embed vizarr — a client-side, GPU-accelerated viewer for OME-NGFF (OME-Zarr) microscopy data. Pan and zoom over multiscale images from cloud storage; no server-side processing required.
---

[vizarr](https://github.com/hms-dbmi/vizarr) is a minimal, client-side image viewer from Harvard Medical School's Department of Biomedical Informatics (HMS-DBMI) for Zarr-based images that follow the [OME-NGFF](https://ngff.openmicroscopy.org/) (OME-Zarr) specification. Built on [Viv](https://github.com/hms-dbmi/viv) for GPU-accelerated rendering, it supports efficient, interactive exploration of large multiscale microscopy datasets in the browser. This package provides an AnyWidget wrapper so you can embed vizarr in any MyST Markdown document or Curvenote article by pointing at a public OME-Zarr source URL.

---

## Live example

The viewer below loads a zebrafish embryo dataset from the [Image Data Resource (IDR)](https://idr.openmicroscopy.org/). Tiles are fetched on demand as you pan and zoom.

::::{figure}
:label: fig:vizarr-zebrafish

:::{any:bundle} https://curvenote.github.io/widgets/widgets/vizarr-viewer.js
{
  "source": "https://uk1s3.embassy.ebi.ac.uk/idr/zarr/v0.1/4495402.zarr",
  "height": "600px"
}
:::

Zebrafish embryo (IDR 4495402) — OME-Zarr multiscale image viewed with vizarr.
::::

**Code:**

````{code} markdown
:::{any:bundle} https://curvenote.github.io/widgets/widgets/vizarr-viewer.js
{
  "source": "https://uk1s3.embassy.ebi.ac.uk/idr/zarr/v0.1/4495402.zarr",
  "height": "600px"
}
:::
````

---

## Installation

Download `vizarr-viewer.js` from this package and host it where you serve static assets (e.g. a MyST site's `public/` folder or a CDN). In published articles or cross-repo use, you can reference the stable build by ...

---

## Usage

Add a vizarr viewer with the `any:bundle` directive. The directive body is a JSON object; only `source` is required.

````{code} markdown
:::{any:bundle} https://curvenote.github.io/widgets/widgets/vizarr-viewer.js
{
  "source": "https://example.com/path/to/your/data.zarr",
  "height": "500px"
}
:::
````

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `source` | `string` | — | URL of the OME-Zarr dataset (**required**). Can be an S3 or other HTTP(S) endpoint that serves the zarr store. |
| `height` | `string` | `"500px"` | Height of the viewer container. |
| `menuOpen` | `boolean` | `false` | Whether the viewer's layer/controls menu is open by default. |

---

## Data format

The viewer expects datasets in [OME-NGFF (OME-Zarr)](https://ngff.openmicroscopy.org/) format: chunked, multiscale arrays stored in Zarr, typically on cloud object storage (e.g. S3). Many public repositories (including the [IDR](https://idr.openmicroscopy.org/)) expose OME-Zarr. If your data is in another format (e.g. OME-TIFF), it must be converted to OME-Zarr for use with this widget.

---

## How it works

The widget is an ESM module that loads the vizarr library at runtime from HMS-DBMI's CDN. When the directive is rendered, it creates a viewer container, initializes vizarr with the given `source` URL, and adds the image layer. All tile loading and rendering happen in the reader's browser; no proxy or backend is required. The underlying Viv stack uses WebGL for GPU-accelerated multiscale rendering.

---

## Source

- Widget: [dev.curvenote.components — vizvarr](https://github.com/curvenote/dev.curvenote.components/tree/main/vizvarr)
- vizarr: [hms-dbmi/vizarr](https://github.com/hms-dbmi/vizarr)
- Viv: [hms-dbmi/viv](https://github.com/hms-dbmi/viv)

---

## Further reading

- [vizarr (HMS-DBMI)](https://github.com/hms-dbmi/vizarr) — client-side Zarr/OME-NGFF viewer
- [OME-NGFF](https://ngff.openmicroscopy.org/) — Next Generation File Format for microscopy
- [Visualizing OME Microscopy Data using Vizarr (opensci.dev)](https://opensci.dev/articles/ome-microscopy-vizarr) — article with additional examples and OME-Zarr background
- [AnyWidget](https://anywidget.dev) — widget model used by this package
- [MyST Markdown widgets](https://mystmd.org/guide/interactive-notebooks)
