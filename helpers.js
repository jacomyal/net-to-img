const path = require("path");
const defaults = require("./defaults");

const { INPUT_FORMATS } = defaults;

exports.inferInputFormatFromPath = function inferinferInputTypeFromPath(
  inputPath
) {
  let ext = path.extname(inputPath);

  if (!ext.includes(".")) return null;

  ext = ext.slice(1).toLowerCase();

  if (!INPUT_FORMATS.includes(ext)) return null;

  return ext;
};
