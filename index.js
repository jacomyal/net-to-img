#!/usr/bin/env node
const argv = require("yargs")
  .usage("Usage: $0 [OPTIONS] SOURCE DEST")
  .demandCommand(2, 2)
  .describe(
    "SOURCE",
    "Path of the input graph file (accepts .GEXF and .GRAPHML files only)"
  )
  .describe("DEST", "Path of the output file (only .PNG supported yet)")
  .alias("c", "colorize")
  .describe("c", "Colorize nodes by communities (using Louvain)")
  .default("c", true)
  .alias("l", "layout")
  .describe("layout", "Randomizes layout and apply ForceAtlas 2")
  .default("layout", true)
  .describe("steps", "Number of ForceAtlas 2 iterations to perform")
  .default("steps", 100)
  .alias("s", "size")
  .describe("size", "Size of the nodes in the output image")
  .default("size", 1)
  .alias("w", "width")
  .describe("width", "Width of the output file")
  .default("w", 2048)
  .alias("h", "height")
  .describe("height", "height of the output file")
  .default("h", 2048).argv;

const [sourcePath, destPath] = argv._;
const { steps, size, width, height } = argv;

const FALSES = ["false", "f", "FALSE", "F"];
const colorize = FALSES.includes(argv.colorize) ? false : argv.colorize;
const layout = FALSES.includes(argv.layout) ? false : argv.layout;

const fs = require("fs");
const path = require("path");
const graphml = require("graphml-js");
const Graph = require("graphology");
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

    const colors = {};
    graph.forEachNode((node, { community }) => {
      if (!colors[community]) colors[community] = getRandomColor();
      graph.setNodeAttribute(node, "color", colors[community]);
    });
  }

  if (layout) {
    graph.forEachNode(node => {
      graph.setNodeAttribute(node, "x", Math.random() * 100);
      graph.setNodeAttribute(node, "y", Math.random() * 100);
    });

    forceAtlas2.assign(graph, { iterations: steps });
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
