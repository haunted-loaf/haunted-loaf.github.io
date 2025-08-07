import { readFileSync } from "node:fs"
import { HypertextCodec } from "./hypertext"
import { renderMarkdown } from "../utils/markdown"
import frontMatter from "front-matter"
import { Metadata } from "../metadata"
import { Entry } from "../entry"
import { Environment, FileSystemLoader, PrecompiledLoader } from "nunjucks"
import { inspect } from "node:util"

function render(template: string, entry: Entry) {
  const context = {
    entry,
    description: entry.codec.metadata.description ?? "",
    root: entry.top,
  }
  const env = new Environment(new FileSystemLoader(".", { noCache: true }))
  env.addFilter("dump", (object) => inspect(object))
  return env.renderString(template.replace(/^---[\s\S]+?---/m, ''), context)
}

export class NunjucksCodec extends HypertextCodec {
  #input?: string
  #output?: string

  get html() {
    return this.#output ?? ""
  }

  get target() {
    return super.target
      .replace(/.njk$/, "")
      .replace(/^\/index$/, "/")
      .replace(/\/index$/, "")
  }

  render() {
    this.#input = readFileSync(this.path).toString().replace(/^#.*$/gm, "")
    this.#output = render(this.#input ?? "", this.entry)
    return super.render()
  }

  generate() {
    this.#input = readFileSync(this.path).toString()
    this.#output = renderMarkdown(this.#input ?? "", this.metadata)
    super.generate()
  }

  collectMetadata() {
    const content = readFileSync(this.path).toString()
    this.metadata = frontMatter<Metadata>(content).attributes
    if (!this.metadata.title) {
      const result = content.match(/^#+\s*(.*)/m)
      if (result) this.metadata.title ??= result[1]
    }
  }
}
