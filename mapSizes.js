const betweennessCentrality = require("graphology-metrics/centrality/betweenness");

const DEFAULT_ATTRIBUTE_KEY = "net-to-img/betweenness-centrality";

/**
 * This function maps some attribute values to node sizes. If no attribute key
 * is given, will first compute betweenness centrality for each node and use
 * those values.
 *
 * Mutates the input graph.
 */
module.exports = function mapSizes(
  graph,
  { attributeKey = DEFAULT_ATTRIBUTE_KEY } = {}
) {
  // If no attribute key has been specified, compute communities instead:
  if (attributeKey === DEFAULT_ATTRIBUTE_KEY) {
    betweennessCentrality.assign(graph, {
      attributes: { centrality: attributeKey }
    });
  }

  // Map attribute values to node sizes:
  if (attributeKey) {
    graph.forEachNode((node, attributes) => {
      const val = +attributes[attributeKey];
      graph.setNodeAttribute(node, "size", !isNaN(val) && val >= 0 ? val : 0);
    });
  }
};
