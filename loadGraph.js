const fs = require("fs");
const Graph = require("graphology");
const gexf = require("graphology-gexf");
const graphml = require("graphology-graphml");

function _loadJSONFile({ data, sourcePath }, callback) {
  const jsonText = data ? data : fs.readFileSync(sourcePath);
  const graph = new Graph();

  try {
    const data = JSON.parse(jsonText);
    graph.import(data);
  } catch (err) {
    callback(err);
  }

  callback(null, graph);
}

function _loadGraphMLFile({ data, sourcePath }, callback) {
  callback(
    null,
    graphml.parse(Graph, data ? data : fs.readFileSync(sourcePath, "utf-8"))
  );
}

function _loadGEXFFile({ data, sourcePath }, callback) {
  callback(
    null,
    gexf.parse(Graph, data ? data : fs.readFileSync(sourcePath, "utf-8"))
  );
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
module.exports = function loadGraph({ data, format, sourcePath }, callback) {
  if (typeof _parsers[format] === "function") {
    _parsers[format]({ data, sourcePath }, callback);
  } else {
    callback(new TypeError(`Format ${format} not recognized.`));
  }
};
