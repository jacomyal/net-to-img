// Deps imports:
const seedrandom = require("seedrandom");
const isGraph = require("graphology-utils/is-graph");

// Local imports:
const DEFAULTS = require("./defaults").DEFAULTS;
const layoutFn = require("./layout");
const colorizeFn = require("./colorize");
const mapSizesFn = require("./mapSizes");
const normalizeFn = require("./normalize");
const loadGraphFn = require("./loadGraph");
const saveImageFn = require("./saveImage");
const helpers = require("./helpers");

function validateParams(params) {
  if (params.graph) {
    if (!isGraph(params.graph))
      throw new Error("net-to-img: expecting a valid graphology instance!");
  } else {
    if (!params.sourcePath)
      throw new Error("net-to-img: expecting a `sourcePath`!");
  }

  if (!params.destPath) throw new Error("net-to-img: expecting a `destPath`!");
}

module.exports = function netToImg(params, callback) {
  let options = params.options || {};
  options = Object.assign({}, DEFAULTS, options);

  // Just in case the user don't want a callback
  callback = callback || Function.prototype;

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

  let { from, to } = options;

  const inputFormatError = new TypeError(
    "net-to-img: could not infer input format!"
  );
  const outputFormatError = new TypeError(
    "net-to-img: could not infer output format!"
  );

  // Inferring formats
  if (!from && sourcePath) {
    from = helpers.inferInputFormatFromPath(sourcePath);

    if (!from) return callback(inputFormatError);
  }

  if (!from && !sourcePath && !params.graph) return callback(inputFormatError);

  if (!to && destPath) {
    to = helpers.inferOutputFormatFromPath(destPath);

    if (!to) return callback(outputFormatError);
  }

  if (!to && !destPath) return callback(outputFormatError);

  function processGraph(graph) {
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
        groupByAttributeKey: colorize === DEFAULTS.colorize && colorize,
      });
    }

    graph = normalizeFn(graph);

    // Render and save img file:
    saveImageFn(
      graph,
      destPath,
      {
        format: to,
        width,
        height,
      },
      (err) => {
        if (typeof callback !== "function") return;

        if (err) return callback(err);

        return callback();
      }
    );
  }

  // Actual program:
  if (params.graph) {
    processGraph(params.graph);
  } else {
    loadGraphFn({ format: from, sourcePath }, function (err, graph) {
      if (err) throw new Error(err);

      processGraph(graph);
    });
  }
};
