// node_modules/unist-builder/lib/index.js
function u(type, props, value) {
  const node = { type: String(type) };
  if ((value === void 0 || value === null) && (typeof props === "string" || Array.isArray(props))) {
    value = props;
  } else {
    Object.assign(node, props);
  }
  if (Array.isArray(value)) {
    node.children = value;
  } else if (value !== void 0 && value !== null) {
    node.value = String(value);
  }
  return node;
}

// src/utils.ts
function makePlaceholder(data, description) {
  const optionList = data.options ? [
    u(
      "ul",
      Object.entries(data.options)?.map(
        ([key, value]) => u("listItem", [u("inlineCode", key), u("text", `: ${String(value)}`)])
      ) ?? []
    )
  ] : [];
  return [
    u("admonition", { kind: "important" }, [
      u("admonitionTitle", [u("inlineCode", [u("text", data.name)])]),
      u("paragraph", [
        u("text", "This block will be replaced with "),
        u("strong", [u("text", description)]),
        u("text", " when deployed to "),
        u("link", { url: "https://curvenote.com" }, [u("text", "Curvenote")]),
        u("text", ".")
      ]),
      u("paragraph", [u("text", "Options:"), ...optionList])
    ])
  ];
}

// src/directive.ts
var seqVizDirective = {
  name: "seqviz",
  doc: "A directive that will load seqparse compatible files and setup visualization using the SegViz library.",
  arg: {
    type: String,
    doc: "The path to the file to load and parse or an accession number.`"
  },
  body: {
    type: String,
    doc: `The body of the directive, if provided, it's fields will be used to populate the SeqViz model. In the 
    case an accession number or file path is provided, the the data in the body will override the data from the 
    file on a field by field basis.`
  },
  options: {
    height: { type: String, doc: "The height of the visualization.`" },
    class: { type: String, doc: "The tailwind classes to apply.`" },
    viewer: {
      type: String,
      doc: "The viewer to use (linear, circular, both, both_flip).`"
    },
    style: { type: Object, doc: "The style to apply to the visualization.`" }
  },
  // TODO: validate(data, vfile) {},
  run(data, _vfile, _opts) {
    const block = u(
      "block",
      {
        kind: "seqviz",
        data: {
          import: "https://curvenote.github.io/widgets/widgets/seqviz.js",
          fileOrAccession: data.arg,
          body: data.body,
          class: data.options?.class ?? "",
          height: data.options?.height ?? "600px",
          viewer: data.options?.viewer ?? "both",
          style: data.options?.style ?? {}
        }
      },
      makePlaceholder(data, data.arg)
    );
    return [block];
  }
};

// src/transform.ts
import seqparse from "seqparse";
import { readFile } from "node:fs/promises";
var seqparseTransform = {
  name: "seqviz-seqparse",
  doc: "A transform that parses an inoming file and prepares a SeqViz model.",
  stage: "document",
  plugin: (_, utils) => async (node) => {
    const nodes = utils.selectAll("block[kind='seqviz']", node) ?? [];
    await Promise.all(
      nodes.map(async (seqvizNode) => {
        const {
          fileOrAccession,
          body,
          class: className,
          height,
          viewer,
          zoom,
          style
        } = seqvizNode.data;
        const seqparseFn = seqparse.default;
        let loadedSeqData;
        try {
          const fileContent = await readFile(fileOrAccession, "utf8");
          const parsed = await seqparseFn(fileContent, {
            fileName: fileOrAccession
          });
          loadedSeqData = parsed;
        } catch (error) {
          console.debug(`Could not locate file, may be an accession: ${error}`);
          try {
            const fetched = await seqparseFn(fileOrAccession);
            loadedSeqData = fetched;
          } catch (error2) {
            console.error(`Error parsing file or accession: ${error2}`);
            return;
          }
        }
        if (!loadedSeqData) {
          return;
        }
        seqvizNode.data = {
          ...seqvizNode.data,
          json: {
            viewer,
            zoom,
            style,
            class: className,
            height,
            ...loadedSeqData,
            ...body
          }
        };
        seqvizNode.kind = "any:bundle";
      })
    );
  }
};

// src/seqviz.ts
var plugin = {
  name: "SeqViz Plugin for MyST Markdown",
  directives: [seqVizDirective],
  transforms: [seqparseTransform]
};
var seqviz_default = plugin;
export {
  seqviz_default as default
};
//# sourceMappingURL=seqviz.mjs.map