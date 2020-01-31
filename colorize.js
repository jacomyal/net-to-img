const iwanthue = require("iwanthue");
const louvain = require("graphology-communities-louvain");

/**
 * This function colorizes nodes based on a given attribute key if specified,
 * or else looks for communities to colorize with Louvain.
 *
 * Mutates the input graph.
 */
module.exports = function colorize(graph, { attributeKey, seed } = {}) {
  // If no attribute key has been specified, compute communities instead:
  if (!attributeKey) {
    attributeKey = "community";
    louvain.assign(graph);
  }

  const valuesSet = {};
  graph.forEachNode((_, attributes) => {
    valuesSet[attributes[attributeKey]] = true;
  });
  const values = Object.keys(valuesSet);

  const colors = iwanthue(values.length, seed ? { seed } : undefined).reduce(
    (iter, color, i) => {
      iter[values[i]] = color;
      return iter;
    },
    {}
  );

  graph.forEachNode((node, attributes) => {
    graph.setNodeAttribute(node, "color", colors[attributes[attributeKey]]);
  });
};
