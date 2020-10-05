#!/usr/bin/env node

// Deps imports:
const yargs = require("yargs");

// Local imports:
const defaults = require("./defaults");
const netToImg = require("./");
const helpers = require("./helpers");

const { DEFAULTS, INPUT_FORMATS, OUTPUT_FORMATS } = defaults;

const ARGV = yargs
  // Main parameters:
  .usage(
    "$0 [source]",
    "Render a graph file (gexf, graphml or json) as an image (png or svg).",
    (yargs) => {
      yargs
        .positional("source", {
          describe:
            "Path to the input graph file (gexf, graphml or json). Will read stdin if absent.",
        })
        .example([
          ["$0 graph.gexf", ":: Converting gexf file to `graph.png`."],
          [
            "$0 graph.gexf -o graph.svg",
            ":: Implicitly converting the graph to SVG.",
          ],
          [
            "cat g.gexf | $0 -f gexf -o graph.png",
            ":: Reading data from stdin.",
          ],
        ]);
    }
  )
  .showHelpOnFail(false)
  .locale("en")
  .wrap(Math.min(100, yargs.terminalWidth()))
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
    "largest-component": {
      description: "Keep only the largest connected component in the output.",
      type: "boolean",
      default: DEFAULTS.largestComponent,
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
  })
  .check((argv) => {
    if (!argv.source) {
      if (!argv.from)
        throw new Error(
          "Cannot infer input type from stdin. Please provide -f/--from!\nBut maybe you just forgot the input file?\nMore info available with --help."
        );
      if (!argv.output)
        throw new Error(
          "Cannot infer output path from stdin. Please provide -o/--output!\nBut maybe you just forgot the input file?\nMore info available with --help."
        );
    }

    return true;
  }).argv;

function argvToParams(callback) {
  const params = {
    sourcePath: ARGV.source,
    destPath: ARGV.output,
    options: {},
  };

  for (const k in DEFAULTS) {
    if (k in ARGV) params.options[k] = ARGV[k];
  }

  // Reading from stdin
  if (!params.sourcePath) {
    return helpers.readStdin((err, data) => {
      if (err) return callback(err);

      params.data = data;

      return callback(null, params);
    });
  }

  return callback(null, params);
}

// Main process
argvToParams((err, params) => {
  if (err) return console.error(err);

  return netToImg(params, (err) => {
    if (err) return console.error(err);
  });
});
