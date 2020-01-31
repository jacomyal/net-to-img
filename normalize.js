/**
 * This function magically resizes nodes positions and sizes to make the graph
 * appear prettier.
 *
 * Mutates the input graph.
 */
module.exports = function normalize(graph) {
  // Retrieve extrema:
  let minSize = Infinity;
  let maxSize = -Infinity;
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  graph.forEachNode((_, { x, y, size = 1 }) => {
    minSize = Math.min(size, minSize);
    maxSize = Math.max(size, maxSize);
    minX = Math.min(x, minX);
    maxX = Math.max(x, maxX);
    minY = Math.min(y, minY);
    maxY = Math.max(y, maxY);
  });

  // Deal with case where min and max node sizes are equals:
  if (maxSize === minSize) {
    minSize = 0;
  }

  // Reposition all nodes between 0 and 100 on X and Y
  // Rescale all nodes arbitrarily considering that:
  //  1. The graph occupies around ~5% of surface
  //  2. Node sizes doesn't depend on shape (so let's use squares)
  //  3. Closest nodes should appear separated by an average node size distance
  //  4. Largest nodes should be 3 times bigger (in radius) than smallest ones
  const MIN_X = 0;
  const MIN_Y = 0;
  const MAX_X = 1000;
  const MAX_Y = 1000;
  const GRAPH_AREA = (MAX_X - MIN_X) * (MAX_Y - MIN_Y) * 0.05;
  const MID_SIZE = Math.sqrt(GRAPH_AREA / graph.order) / 2; // Divide by two because radius
  const MAX_SIZE = minSize === maxSize ? MID_SIZE : 2 * MID_SIZE;
  const MIN_SIZE = MAX_SIZE / 3;

  graph.forEachNode((node, { x, y, size = 1 }) => {
    graph.setNodeAttribute(
      node,
      "x",
      MIN_X + ((x - minX) / (maxX - minX)) * (MAX_X - MIN_X)
    );
    graph.setNodeAttribute(
      node,
      "y",
      MIN_Y + ((y - minY) / (maxY - minY)) * (MAX_Y - MIN_Y)
    );
    graph.setNodeAttribute(
      node,
      "size",
      MIN_SIZE +
        ((size - minSize) / (maxSize - minSize)) * (MAX_SIZE - MIN_SIZE)
    );
  });
};
