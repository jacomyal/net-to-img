const path = require("path");
const savePNGFile = require("graphology-canvas");
const saveSVGFile = require("graphology-svg");

function _savePNG(graph, destPath, { width, height, callback }) {
  savePNGFile(graph, destPath, { width, height }, () => {
    if (typeof callback === "function") callback();
  });
}

function _saveSVG(graph, destPath, { width, height, callback }) {
  saveSVGFile(graph, destPath, { width, height }, () => {
    if (typeof callback === "function") callback();
  });
}

const _exporters = {
  png: _savePNG,
  svg: _saveSVG,
};

module.exports = function saveImage(
  graph,
  destPath,
  { width, height, callback }
) {
  const ext = path
    .extname(destPath)
    .substr(1) // Remove starting dot
    .toLowerCase();

  if (typeof _exporters[ext] === "function") {
    _exporters[ext](graph, destPath, { width, height, callback });
  } else {
    callback(`File extension ${ext} not recognized.`);
  }
};
