#!/usr/bin/env node

// Deps imports:
const yargs = require("yargs");
const render = require("graphology-canvas");

// Local imports:
const layoutFn = require("./layout");
const colorizeFn = require("./colorize");
const mapSizesFn = require("./mapSizes");
const normalizeFn = require("./normalize");
const loadGraphFn = require("./loadGraph");
const saveImageFn = require("./saveImage");

const defaultColorizeKey = colorizeFn.DEFAULT_ATTRIBUTE_KEY;
const defaultMapSizesKey = mapSizesFn.DEFAULT_ATTRIBUTE_KEY;

const argv = yargs
  // Main parameters:
  .usage("Usage: $0 [OPTIONS] SOURCE DEST")
  .demandCommand(2, 2)
  .describe(
    "SOURCE",
    "Path of the input graph file (accepts .GEXF, .GRAPHML and .JSON files only)"
  )
  .describe("DEST", "Path of the output file (only .PNG supported yet)")
  // Options:
  .options({
    layout: {
      alias: "l",
      description: "Randomizes layout and applies ForceAtlas 2",
      default: true
    },
    steps: {
      alias: "s",
      description: "Number of ForceAtlas 2 iterations to perform",
      default: 100
    },
    colorize: {
      alias: "c",
      description:
        "Maps an attribute values to node colors. Uses Louvain communities by default. Use --no-colorize or --no-c to preserve node colors.",
      default: defaultColorizeKey
    },
    "map-sizes": {
      alias: "m",
      description:
        "Maps an attribute values to node sizes. Uses betweenness centrality by default. Use --no-map-sizes or --no-m to preserve node sizes.",
      default: defaultMapSizesKey
    },
    seed: {
      description: 'A seed for RNG (set it to "" or use --no-seed to unset it)',
      default: "net-to-img"
    },
    width: {
      alias: "w",
      description: "Width of the output image",
      default: 2048
    },
    height: {
      alias: "h",
      description: "height of the output image",
      default: 2048
    }
  }).argv;

// Arguments and options:
const [sourcePath, destPath] = argv._;
const { steps, width, height, colorize, layout } = argv;
const mapSizes = argv["map-sizes"];
const seed = argv.seed || undefined;

// Actual program:
loadGraphFn({ sourcePath }, function(err, graph) {
  if (err) throw new Error(err);

  // Graph treatments:
  if (colorize !== false) {
    colorizeFn(graph, { attributeKey: colorize, seed });
  }

  if (mapSizes !== false) {
    mapSizesFn(graph, { attributeKey: mapSizes });
  }

  if (layout !== false) {
    layoutFn(graph, { steps, seed });
  }

  normalizeFn(graph);

  // Render and save img file:
  saveImageFn(
    graph,
    destPath,
    {
      width,
      height
    },
    () => {
      // Process ended (callback is mandatory...)
    }
  );
});
