#!/usr/bin/env node

// Deps imports:
const yargs = require("yargs");
const render = require("graphology-canvas");

// Local imports:
const layoutFn = require("./layout");
const colorizeFn = require("./colorize");
const normalizeFn = require("./normalize");
const loadGraphFn = require("./loadGraph");

const argv = yargs
  // Main parameters:
  .usage("Usage: $0 [OPTIONS] SOURCE DEST")
  .demandCommand(2, 2)
  .describe(
    "SOURCE",
    "Path of the input graph file (accepts .GEXF and .GRAPHML files only)"
  )
  .describe("DEST", "Path of the output file (only .PNG supported yet)")
  // Options:
  .options({
    colorize: {
      alias: "c",
      description: "Colorize nodes by communities (using Louvain)",
      default: true
    },
    layout: {
      alias: "l",
      description: "Randomizes layout and apply ForceAtlas 2",
      default: true
    },
    steps: {
      alias: "s",
      description: "Number of ForceAtlas 2 iterations to perform",
      default: 100
    },
    seed: {
      alias: "r",
      description: 'A seed for RNG (set it to "" or use --no-seed to unset it)',
      default: "net-to-img"
    },
    width: {
      description: "Width of the output file",
      default: 2048
    },
    height: {
      description: "height of the output file",
      default: 2048
    }
  }).argv;

// Arguments and options:
const [sourcePath, destPath] = argv._;
const { steps, seed, width, height } = argv;
const FALSES = ["false", "f", "FALSE", "F"];
const colorize = FALSES.includes(argv.colorize) ? false : argv.colorize;
const layout = FALSES.includes(argv.layout) ? false : argv.layout;

// Actual program:
loadGraphFn({ sourcePath }, function(err, graph) {
  if (err) throw new Error(err);

  // Graph treatments:
  let cleanSeed = seed || undefined;

  if (colorize) {
    colorizeFn(graph, { seed: cleanSeed });
  }

  if (layout) {
    layoutFn(graph, { steps, seed: cleanSeed });
  }

  normalizeFn(graph);

  // Render and save img file:
  render(
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
