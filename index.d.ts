import Graph from "graphology-types";

export type NetToImgOptions = {
  width: number;
  height: number;
  colorize: string;
  mapSizes: string;
  layout: boolean;
  steps: number;
  seed: string | undefined;
};

export interface NetToImgParamsFromPaths {
  sourcePath: string;
  destPath: string;
  options?: NetToImgOptions;
}

export interface NetToImgParamsFromGraph {
  graph: Graph;
  destPath: string;
  options?: NetToImgOptions;
}

export type NetToImgParams = NetToImgParamsFromPaths | NetToImgParamsFromGraph;

export default function netToImg(
  params: NetToImgParams,
  callback: (error?: Error) => void
): void;
