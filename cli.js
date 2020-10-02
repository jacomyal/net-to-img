#!/usr/bin/env node

// Deps imports:
const yargs = require("yargs");

// Local imports:
const DEFAULTS = require("./defaults");
const netToImg = require("./");

const argv = yargs
  // Main parameters:
  .usage("Usage: $0 [OPTIONS] SOURCE DEST")
  .demandCommand(2, 2)
  .describe(
    "SOURCE",
    "Path of the input graph file (accepts .GEXF, .GRAPHML and .JSON files only)"
  )
  .describe("DEST", "Path of the output file (only .PNG and .SVG supported yet)")
  // Options:
  .options({
    layout: {
      alias: "l",
      description: "Randomizes layout and applies ForceAtlas 2",
      default: DEFAULTS.layout,
    },
    steps: {
      alias: "s",
      description: "Number of ForceAtlas 2 iterations to perform",
      default: DEFAULTS.steps,
    },
    colorize: {
      alias: "c",
      description:
        "Maps an attribute values to node colors. Uses Louvain communities by default. Use --no-colorize or --no-c to preserve node colors.",
      default: DEFAULTS.colorize,
    },
    "map-sizes": {
      alias: "m",
      description:
        "Maps an attribute values to node sizes. Uses betweenness centrality by default. Use --no-map-sizes or --no-m to preserve node sizes.",
      default: DEFAULTS.mapSizes,
    },
    seed: {
      description: 'A seed for RNG (set it to "" or use --no-seed to unset it)',
      default: DEFAULTS.seed,
    },
    width: {
      alias: "w",
      description: "Width of the output image",
      default: DEFAULTS.width,
    },
    height: {
      alias: "h",
      description: "height of the output image",
      default: DEFAULTS.height,
    },
  }).argv;

function argvToParams() {
  const params = {
    sourcePath: argv._[0],
    destPath: argv._[1],
    options: {},
  };

  for (const k in DEFAULTS) {
    if (k in argv) params.options[k] = argv[k];
  }

  return params;
}

netToImg(argvToParams(), (err) => {
  if (err) console.error(err);
});
