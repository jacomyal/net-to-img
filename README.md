# net-to-img

A CLI tool to quickly render a network's topology as an image. Its goal is to make it easy to visually detect some graph patterns ([stars](<https://en.wikipedia.org/wiki/Star_(graph_theory)>) for instance).

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

## Disclaimer

This tool has been developped quite quickly (thanks for all the job previously done in the [Graphology](https://github.com/graphology) environment by [Guillaume Plique](http://github.com/yomguithereal)), and it breaks very easily, on a lot of the graph files I tried it on. It could be improved, especially around the following issues:

- Errors management
- Stronger GraphML parser
- Louvain multi-graph support
- ~~Auto sizes for nodes~~
- More graph formats (GML, ~~JSON~~...)
- More image formats (JPG, ~~SVG~~...)
- ...
