const forceAtlas2 = require("graphology-layout-forceatlas2");

module.exports = function layout(graph, { seed, steps = 100, size = 100 }) {
  // If a seed is provided, then the graph shouldn't be randomized:
  if (seed) {
    const dAngle = (Math.PI * 2) / graph.order;
    let angle = 0;
    graph.forEachNode(node => {
      graph.setNodeAttribute(node, "x", (Math.cos(angle) * size) / 2);
      graph.setNodeAttribute(node, "y", (Math.sin(angle) * size) / 2);
      angle += dAngle;
    });
  } else {
    graph.forEachNode(node => {
      graph.setNodeAttribute(node, "x", Math.random() * size);
      graph.setNodeAttribute(node, "y", Math.random() * size);
    });
  }

  forceAtlas2.assign(graph, {
    iterations: steps,
    settings: forceAtlas2.inferSettings(graph)
  });
};
