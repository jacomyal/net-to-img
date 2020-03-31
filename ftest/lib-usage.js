const imgToNet = require('../');
const Graph = require('graphology');
const clusters = require('graphology-generators/random/clusters');

const graph = clusters(Graph, {
  order: 50,
  size: 500,
  clusters: 3
});

imgToNet({graph, destPath: process.argv[2]});
