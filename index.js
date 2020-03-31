// Deps imports:
const seedrandom = require("seedrandom");

// Local imports:
const DEFAULTS = require("./defaults");
const layoutFn = require("./layout");
const colorizeFn = require("./colorize");
const mapSizesFn = require("./mapSizes");
const normalizeFn = require("./normalize");
const loadGraphFn = require("./loadGraph");
const saveImageFn = require("./saveImage");

function validateParams(params) {
  if (!params.sourcePath)
    throw new Error("net-to-img: expecting a `sourcePath`!");

  if (!params.targetPath)
    throw new Error("net-to-img: expecting a `targetPath`!");
}

module.exports = function netToImg(params, callback) {
  let options = params.options || {};
  options = Object.assign({}, DEFAULTS, options);

  validateParams(params);

  // Extracting options
  const { sourcePath, destPath } = params;
  const {
    steps,
    width,
    height,
    colorize,
    mapSizes,
    layout,
    seed = undefined,
  } = options;

  // Actual program:
  loadGraphFn({ sourcePath }, function (err, graph) {
    if (err) throw new Error(err);

    // Randomness and seeds:
    if (seed) {
      seedrandom(seed, { global: true });
    }

    // Graph treatments:
    if (colorize !== false) {
      graph = colorizeFn(graph, { attributeKey: colorize, seed });
    }

    if (mapSizes !== false) {
      graph = mapSizesFn(graph, { attributeKey: mapSizes });
    }

    if (layout !== false) {
      graph = layoutFn(graph, {
        steps,
        seed,
        groupByAttributeKey: colorize === defaultColorizeKey && colorize,
      });
    }

    graph = normalizeFn(graph);

    // Render and save img file:
    saveImageFn(
      graph,
      destPath,
      {
        width,
        height,
      },
      (err) => {
        if (typeof callback !== "function") return;

        if (err) return callback(err);

        return callback();
      }
    );
  });
};
