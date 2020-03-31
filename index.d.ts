export type NetToImgOptions = {
  width: number;
  height: number;
  colorize: string;
  mapSizes: string;
  layout: boolean;
  steps: number;
  seed: string | undefined;
};

export interface NetToImgParams {
  sourcePath: string;
  destPath: string;
  options?: NetToImgOptions;
}

export default function netToImg(
  params: NetToImgParams,
  callback: (error?: Error) => void
): void;
