const { describe } = require("yargs");

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
});
