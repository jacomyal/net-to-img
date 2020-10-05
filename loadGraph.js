const fs = require("fs");
const Graph = require("graphology");
const gexf = require("graphology-gexf");
const graphml = require("graphology-graphml");

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
  callback(null, graphml.parse(Graph, fs.readFileSync(sourcePath, "utf-8")));
}

function _loadGEXFFile({ sourcePath }, callback) {
  callback(null, gexf.parse(Graph, fs.readFileSync(sourcePath, "utf-8")));
}

const _parsers = {
  json: _loadJSONFile,
  graphml: _loadGraphMLFile,
  gexf: _loadGEXFFile,
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
module.exports = function loadGraph({ format, sourcePath }, callback) {
  if (typeof _parsers[format] === "function") {
    _parsers[format]({ sourcePath }, callback);
  } else {
    callback(new TypeError(`Format ${format} not recognized.`));
  }
};
