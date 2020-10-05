# net-to-img

A CLI tool and library to quickly render a network's topology as an image. Its goal is to make it easy to visually detect some graph patterns ([stars](<https://en.wikipedia.org/wiki/Star_(graph_theory)>) for instance).

## Installation

```bash
npm install --global net-to-img
```

## Usage

At the moment, `net-to-img` only supports [GraphML](https://en.wikipedia.org/wiki/GraphML), [GEXF](https://gephi.org/gexf/format/) and [JSON for Graphology](https://graphology.github.io/serialization.html#format) formats, and only writes images as PNG images:

```bash
net-to-img path/to/graph/file path/to/output/image
```

To see the list of all options, run:

```bash
net-to-img --help
```

## Library usage

You can also use `net-to-img` programmatically if you need to:

```js
const netToImg = require("net-to-img");

netToImg(
  {
    sourcePath: "path/to/graph/file",
    destPath: "path/to/output/image",
    options: {
      layout: false,
    },
  },
  (err) => {
    if (!err) console.log("Everything went well!");
  }
);

// To directly pass a graph instance
netToImg(
  {
    graph: myGraph,
    destPath: "path/to/output/image",
    options: {
      layout: false,
    },
  },
  (err) => {
    if (!err) console.log("Everything went well!");
  }
);

// Directly passing string data
netToImg(
  {
    data: "<gexf as string>",
    destPath: "path/to/output/image",
    options: {
      from: "gexf",
      layout: false,
    },
  },
  (err) => {
    if (!err) console.log("Everything went well!");
  }
);
```

## Disclaimer

This tool has been developped quite quickly (thanks for all the job previously done in the [Graphology](https://github.com/graphology) environment by [Guillaume Plique](http://github.com/yomguithereal)), and it breaks very easily, on a lot of the graph files I tried it on. It could be improved, especially around the following issues:

- Errors management
- ~~Stronger GraphML parser~~
- ~~Louvain multi-graph support~~
- ~~Auto sizes for nodes~~
- More graph formats (GML, ~~JSON~~...)
- More image formats (JPG, ~~SVG~~...)
- ...

## Changelog

### v0.5.0

- Revamping IO (`-f/--from`, `-t/--to`, `-o/--output`, stdin support etc.)
- Fixing SVG output

### v0.4.0

- Adding possibility to directly pass a `graphology` instance

### v0.3.0

- `net-to-img` can now be used as a library

### v0.2.1

- Allow parallel edges in GraphML files

### v0.2.0

- [#2](https://github.com/jacomyal/net-to-img/issues/2) - Use FA2 [#.inferSettings](https://github.com/graphology/graphology-layout-forceatlas2#infersettings)
- [#1](https://github.com/jacomyal/net-to-img/issues/1) - Use [iwanthue](https://www.npmjs.com/package/iwanthue) for colors
- Clearer command options declaration
- [#7](https://github.com/jacomyal/net-to-img/issues/7) - RNG seeds, refactoring
- Accept files formatted as JSON for Graphology
- New option `mapSizes`
- Better API
- Export SVG images
- Better initial FA2 layout
- [#11](https://github.com/jacomyal/net-to-img/issues/11) - Cast graphs to simple before Louvain
