import { readFileSync } from "node:fs";
import { HypertextCodec } from "./hypertext";
import { renderMarkdown } from "../utils/markdown";
import frontMatter from "front-matter"
import { Metadata } from "../metadata";

export class MarkdownCodec extends HypertextCodec {
  #input?: string;
  #output?: string;

  get html() {
    return this.#output ?? "";
  }

  get target() {
    const tgt = super.target.replace(/.md$/, ".html");
    if (!tgt.endsWith("/index.html"))
      return tgt.replace(/.html/, "/index.html")
    return tgt
  }

  generate() {
    this.#input = readFileSync(this.path).toString();
    this.#output = renderMarkdown(this.#input ?? "", this.metadata);
    super.generate()
  }

  collectMetadata() {
    const content = readFileSync(this.path).toString()
    this.metadata = frontMatter<Metadata>(content).attributes
    if (!this.metadata.title) {
      const result = content.match(/^#+\s*(.*)/m)
      if (result)
        this.metadata.title ??= result[1]
    }
    // this.#input = readFileSync(this.path).toString();
    // this.#output = renderMarkdown(this.#input!, this.metadata);
  }
}
