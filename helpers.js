const path = require("path");
const defaults = require("./defaults");

const { INPUT_FORMATS, OUTPUT_FORMATS } = defaults;

function createInferFormatFromPath(allowedFormats) {
  return (inputPath) => {
    let ext = path.extname(inputPath);

    if (!ext.includes(".")) return null;

    ext = ext.slice(1).toLowerCase();

    if (!allowedFormats.includes(ext)) return null;

    return ext;
  };
}

exports.inferInputFormatFromPath = createInferFormatFromPath(INPUT_FORMATS);
exports.inferOutputFormatFromPath = createInferFormatFromPath(OUTPUT_FORMATS);
