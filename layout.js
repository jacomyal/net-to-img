const forceAtlas2 = require("graphology-layout-forceatlas2");

const INITIAL_LAYOUT_SIZE = 100;

/**
 * This function computes node positions with the ForceAtlas2 algorithm.
 *
 * Returns a graph instance (might mutate the input graph though).
 */
module.exports = function layout(
  graph,
  { seed, steps = 100, groupByAttributeKey }
) {
  // If a `groupByAttributeKey` is provided, group nodes by the given key and
  // place them on a circle:
  if (groupByAttributeKey) {
    const groups = {};
    const noValue = "net-to-img/no-value";
    graph.forEachNode((node, attributes) => {
      const val = attributes[groupByAttributeKey] || noValue;
      groups[val] = groups[val] || [];
      groups[val].push(node);
    });

    const dAngle = (Math.PI * 2) / graph.order;
    let angle = 0;
    for (const key in groups) {
      const group = groups[key];
      group.forEach((node) => {
        graph.setNodeAttribute(
          node,
          "x",
          (Math.cos(angle) * INITIAL_LAYOUT_SIZE) / 2
        );
        graph.setNodeAttribute(
          node,
          "y",
          (Math.sin(angle) * INITIAL_LAYOUT_SIZE) / 2
        );
        angle += dAngle;
      });
    }
  } else {
    graph.forEachNode((node) => {
      graph.setNodeAttribute(node, "x", Math.random() * INITIAL_LAYOUT_SIZE);
      graph.setNodeAttribute(node, "y", Math.random() * INITIAL_LAYOUT_SIZE);
    });
  }

  forceAtlas2.assign(graph, {
    iterations: steps,
    settings: forceAtlas2.inferSettings(graph),
  });

  return graph;
};
