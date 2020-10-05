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

exports.inferOutputPath = function inferOutputPath(inputPath, format) {
  return path.join(
    path.dirname(inputPath),
    path.basename(inputPath, path.extname(inputPath)) + "." + format
  );
};

exports.readStdin = function readStdin(callback) {
  const stdin = process.stdin;

  stdin.setEncoding("utf-8");

  const chunks = [];

  stdin.on("data", (chunk) => {
    chunks.push(chunk);
  });

  stdin.on("end", (err) => {
    if (err) return callback(err);

    return callback(null, chunks.join(""));
  });

  stdin.resume();
};
