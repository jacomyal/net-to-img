const DEFAULT_COLORIZE_KEY = require("./colorize").DEFAULT_ATTRIBUTE_KEY;
const DEFAULT_MAP_SIZE_KEY = require("./mapSizes").DEFAULT_ATTRIBUTE_KEY;

exports.DEFAULTS = {
  // Formats
  from: null,
  to: null,

  // Dimensions
  width: 2048,
  height: 2048,

  // Visualization
  colorize: DEFAULT_COLORIZE_KEY,
  mapSizes: DEFAULT_MAP_SIZE_KEY,

  // Layout
  layout: true,
  steps: 100,

  // Misc
  seed: "net-to-img",
};

exports.INPUT_FORMATS = ["gexf", "graphml", "json"];
exports.OUTPUT_FORMATS = ["png", "svg"];
