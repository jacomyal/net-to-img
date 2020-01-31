const fs = require("fs");
const path = require("path");
const graphml = require("graphml-js");
const Graph = require("graphology");
const gexf = require("graphology-gexf");

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

/**
 * This function loads a graph file, instanciates Graphology with its data, and
 * calls an input callback with it.
 *
 * Currently supports GEXF and GraphML.
 */
module.exports = function loadGraph({ sourcePath }, callback) {
  const ext = path.extname(sourcePath).toLowerCase();

  if (ext === ".gexf") {
    _loadGEXFFile({ sourcePath }, callback);
  } else if (ext === ".graphml") {
    _loadGraphMLFile({ sourcePath }, callback);
  } else {
    callback(`File extension ${ext} not recognized.`);
  }
};
