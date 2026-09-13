/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VTX_CATALOG_DATA_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.svg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "fs" {
  const fs: any;
  export = fs;
}

declare module "path" {
  const path: any;
  export = path;
}

declare module "node:path" {
  const path: any;
  export default path;
}

declare const process: {
  cwd(): string;
};

declare const __dirname: string;
