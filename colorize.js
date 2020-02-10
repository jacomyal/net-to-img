const iwanthue = require("iwanthue");
const louvain = require("graphology-communities-louvain");
const { toSimple } = require("graphology-operators");

/**
 * This function colorizes nodes based on a given attribute key if specified,
 * or else looks for communities to colorize with Louvain.
 *
 * Returns a graph instance (might mutate the input graph though).
 */
function colorize(graph, { attributeKey, seed } = {}) {
  if (attributeKey === colorize.DEFAULT_ATTRIBUTE_KEY) {
    graph = toSimple(graph);
    louvain.assign(graph, { attributes: { community: attributeKey } });
  }

  const valuesSet = {};
  graph.forEachNode((_, attributes) => {
    valuesSet[attributes[attributeKey]] = true;
  });
  const values = Object.keys(valuesSet);

  const colors = (values.length > 1
    ? iwanthue(values.length, seed ? { seed } : undefined)
    : ["grey"]
  ).reduce((iter, color, i) => {
    iter[values[i]] = color;
    return iter;
  }, {});

  graph.forEachNode((node, attributes) => {
    graph.setNodeAttribute(node, "color", colors[attributes[attributeKey]]);
  });

  return graph;
}

colorize.DEFAULT_ATTRIBUTE_KEY = "net-to-img/community";
module.exports = colorize;
