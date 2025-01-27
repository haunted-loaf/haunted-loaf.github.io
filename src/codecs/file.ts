import { copyFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

export class FileCodec extends Codec {
  generate() {
    mkdirSync(dirname(this.target), { recursive: true });
    copyFileSync(this.path, this.target);
  }
}

import { Codec } from "./codec";
