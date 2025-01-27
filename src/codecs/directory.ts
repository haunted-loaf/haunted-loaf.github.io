import { join } from "node:path";
import { HypertextCodec } from "./hypertext"

export class DirectoryCodec extends HypertextCodec {
  html = "";

  get defaultMetadata() {
    return Object.assign({}, super.defaultMetadata,  {
      showIndex: true,
    })
  }

  get target() {
    return join(super.target, "index.html");
  }
}
