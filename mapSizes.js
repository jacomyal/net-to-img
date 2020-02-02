const betweennessCentrality = require("graphology-metrics/centrality/betweenness");

/**
 * This function maps some attribute values to node sizes. If no attribute key
 * is given, will first compute betweenness centrality for each node and use
 * those values.
 *
 * Mutates the input graph.
 */
function mapSizes(graph, { attributeKey } = {}) {
  if (attributeKey === mapSizes.DEFAULT_ATTRIBUTE_KEY) {
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
}

mapSizes.DEFAULT_ATTRIBUTE_KEY = "net-to-img/betweenness-centrality";
module.exports = mapSizes;
