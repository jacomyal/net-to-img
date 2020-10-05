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
  { format, width, height, callback }
) {
  if (typeof _exporters[format] === "function") {
    _exporters[format](graph, destPath, { width, height, callback });
  } else {
    callback(new TypeError(`File extension ${format} not recognized.`));
  }
};
