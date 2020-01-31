#!/usr/bin/env node
const argv = require("yargs")
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
      description: "Number of ForceAtlas 2 iterations to perform",
      default: 100
    },
    size: {
      alias: "s",
      description: "Size of the nodes in the output image",
      decault: 1
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

const [sourcePath, destPath] = argv._;
const { steps, size, width, height } = argv;
const FALSES = ["false", "f", "FALSE", "F"];
const colorize = FALSES.includes(argv.colorize) ? false : argv.colorize;
const layout = FALSES.includes(argv.layout) ? false : argv.layout;

const fs = require("fs");
const path = require("path");
const graphml = require("graphml-js");
const Graph = require("graphology");
const iwanthue = require("iwanthue");
const gexf = require("graphology-gexf");
const render = require("graphology-canvas");
const forceAtlas2 = require("graphology-layout-forceatlas2");
const louvain = require("graphology-communities-louvain");

function getRandomColor() {
  return (
    "#" +
    (((1 << 24) * Math.random()) | 0).toString(16) +
    "000000"
  ).substr(0, 7);
}

// 1. Load graph file
function loadGraphMLFile({ sourcePath }, callback) {
  const graphmlText = fs.readFileSync(sourcePath);
  const parser = new graphml.GraphMLParser();

  parser.parse(graphmlText, function(err, data) {
    if (err) return callback(err);

    const graph = new Graph();
    data.nodes.forEach(node => {
      graph.addNode(node._id, node._attributes);
    });
    data.edges.forEach(edge => {
      if (!graph.hasEdge(edge._source, edge._target))
        graph.addEdge(edge._source, edge._target, edge._attributes);
    });

    callback(err, graph);
  });
}
function loadGEXFFile({ sourcePath }, callback) {
  callback(null, gexf.parse(Graph, fs.readFileSync(sourcePath, "utf-8")));
}
function loadGraphFile({ sourcePath }, callback) {
  const ext = path.extname(sourcePath).toLowerCase();

  if (ext === ".gexf") {
    loadGEXFFile({ sourcePath }, callback);
  } else if (ext === ".graphml") {
    loadGraphMLFile({ sourcePath }, callback);
  } else {
    callback(`File extension ${ext} not recognized.`);
  }
}

// 2. Process graph
function processGraph({ graph }, callback) {
  if (colorize) {
    louvain.assign(graph);

    const communitiesSet = {};
    graph.forEachNode((_, { community }) => {
      communitiesSet[community] = true;
    });
    const communities = Object.keys(communitiesSet);

    const colors = iwanthue(communities.length).reduce((iter, color, i) => {
      iter[communities[i]] = color;
      return iter;
    }, {});

    graph.forEachNode((node, { community }) => {
      graph.setNodeAttribute(node, "color", colors[community]);
    });
  }

  if (layout) {
    graph.forEachNode(node => {
      graph.setNodeAttribute(node, "x", Math.random() * 100);
      graph.setNodeAttribute(node, "y", Math.random() * 100);
    });

    forceAtlas2.assign(graph, {
      iterations: steps,
      settings: forceAtlas2.inferSettings(graph)
    });
  }

  graph.forEachNode(node => {
    graph.setNodeAttribute(node, "size", size);
  });

  callback(null, graph);
}

// 3. Export img
function exportImg({ graph, destPath }, callback) {
  render(
    graph,
    destPath,
    {
      width,
      height
    },
    () => {
      callback(null, null);
    }
  );
  callback(null, null);
}

// 4. Bootstrap
loadGraphFile({ sourcePath }, function(err, graph) {
  if (err) throw new Error(err);
  processGraph({ graph }, function(err, graph) {
    if (err) throw new Error(err);
    exportImg({ graph, destPath }, function() {
      if (err) throw new Error(err);
    });
  });
});
