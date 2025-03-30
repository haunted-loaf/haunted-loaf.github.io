import { HypertextCodec } from "./hypertext"

export class DirectoryCodec extends HypertextCodec {
  html = "";

  get defaultMetadata() {
    return Object.assign({}, super.defaultMetadata,  {
      showIndex: true,
    })
  }

  get target() {
    return super.target === "." ? "/" : super.target;
  }
}
