#!/usr/bin/env node

// Deps imports:
const yargs = require("yargs");

// Local imports:
const defaults = require("./defaults");
const netToImg = require("./");

const { DEFAULTS, INPUT_FORMATS, OUTPUT_FORMATS } = defaults;

const argv = yargs
  // Main parameters:
  .usage(
    "$0 [source]",
    "Render a graph file (gexf, graphml or json) as an image (png or svg).",
    (yargs) => {
      yargs.positional("source", {
        describe:
          "Path to the input graph file (gexf, graphml or json). Will read stdin if absent.",
      });
    }
  )
  .locale("en")
  // Options:
  .options({
    output: {
      alias: "o",
      description:
        "Path to the output image file to create (png or svg). Will be created from the input path if absent.",
    },
    from: {
      alias: "f",
      description:
        "Input graph format. Will be inferred from input file extension if absent.",
      choices: INPUT_FORMATS,
    },
    to: {
      alias: "t",
      description:
        "Output image format. Will be inferred from output file extension if absent.",
      choices: OUTPUT_FORMATS,
    },
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
    sourcePath: argv.source,
    destPath: argv.output,
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
