const assert = require("assert");
const helpers = require("../helpers");

describe("helpers", function () {
  describe("#.inferInputFormatFromPath", function () {
    it("should return the proper format or null.", function () {
      const tests = [
        ["/home/usr/john/graph.gexf", "gexf"],
        ["test.graphml", "graphml"],
        ["~/whatever/ok/g.JSON", "json"],
        ["/home/.gitignore", null],
        ["./file.png", null],
      ];

      tests.forEach(([path, format]) => {
        assert.strictEqual(helpers.inferInputFormatFromPath(path), format);
      });
    });
  });

  describe("#.inferOutputFormatFromPath", function () {
    it("should return the proper format or null.", function () {
      const tests = [
        ["/home/usr/john/image.png", "png"],
        ["test.svg", "svg"],
        ["~/whatever/ok/g.SVG", "svg"],
        ["/home/.gitignore", null],
        ["./file.gexf", null],
      ];

      tests.forEach(([path, format]) => {
        assert.strictEqual(helpers.inferOutputFormatFromPath(path), format);
      });
    });
  });

  describe("#.inferOutputPath", function () {
    it("should correctly infer an output path.", function () {
      const tests = [
        ["/home/usr/john/graph.gexf", "png", "/home/usr/john/graph.png"],
        ["test.graphml", "svg", "test.svg"],
        ["~/whatever/ok/g.JSON", "png", "~/whatever/ok/g.png"],
      ];

      tests.forEach(([path, format, inferred]) => {
        assert.strictEqual(helpers.inferOutputPath(path, format), inferred);
      });
    });
  });
});
