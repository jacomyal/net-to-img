const fs = require("fs");
const path = require("path");
const graphml = require("graphml-js");
const Graph = require("graphology");
const gexf = require("graphology-gexf");

function _loadJSONFile({ sourcePath }, callback) {
  const jsonText = fs.readFileSync(sourcePath);
  const graph = new Graph();

  try {
    const data = JSON.parse(jsonText);
    graph.import(data);
  } catch (err) {
    callback(err);
  }

  callback(null, graph);
}

function _loadGraphMLFile({ sourcePath }, callback) {
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

function _loadGEXFFile({ sourcePath }, callback) {
  callback(null, gexf.parse(Graph, fs.readFileSync(sourcePath, "utf-8")));
}

const _parsers = {
  json: _loadJSONFile,
  graphml: _loadGraphMLFile,
  gexf: _loadGEXFFile
};

/**
 * This function loads a graph file, instanciates Graphology with its data, and
 * calls an input callback with it.
 *
 * Currently supports:
 *   - GEXF (https://gephi.org/gexf/format/)
 *   - GraphML (https://en.wikipedia.org/wiki/GraphML)
 *   - JSON for Graphology (https://graphology.github.io/serialization.html)
 */
module.exports = function loadGraph({ sourcePath }, callback) {
  const ext = path
    .extname(sourcePath)
    .substr(1) // Remove starting dot
    .toLowerCase();

  if (typeof _parsers[ext] === "function") {
    _parsers[ext]({ sourcePath }, callback);
  } else {
    callback(`File extension ${ext} not recognized.`);
  }
};
