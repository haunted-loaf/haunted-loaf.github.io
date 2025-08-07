import prettier from "prettier"
import { minify } from "html-minifier-terser"
import { renderToString } from "react-dom/server"
import { splitPath } from "./utils/paths"
import YAML from "yaml"
import { mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs"
import { dirname, extname, join, parse } from "node:path"
import { Entry } from "./entry.js"
import {
  Codec,
  DirectoryCodec,
  FileCodec,
  MarkdownCodec,
  NunjucksCodec,
  SassCodec,
} from "./codecs/index.js"
import { isEqual, sortBy } from "underscore"
import { extension } from "mime-types"

export class Generator {
  roots: string[] = []
  outputs: Record<string, Codec> = {}
  root?: Entry

  reset() {
    this.roots = []
    this.outputs = {}
    this.root = undefined
  }

  #codecFor(path: string, root: string) {
    if (statSync(path).isDirectory()) {
      return new DirectoryCodec(this, path, root)
    }
    if (extname(path) === ".md") {
      return new MarkdownCodec(this, path, root)
    }
    if (extname(path) === ".njk") {
      return new NunjucksCodec(this, path, root)
    }
    if (extname(path) === ".scss") {
      return new SassCodec(this, path, root)
    }
    // if ([".png", ".jpg", ".svg"].includes(extname(path))) {
    //   return new FileCodec(this, path, root)
    // }
    return new FileCodec(this, path, root)
  }

  scan(root: string) {
    const helper = (path: string) => {
      const stat = statSync(path)
      if (!stat.isDirectory() && !stat.isFile()) return
      const codec = this.#codecFor(path, root)
      this.outputs[codec.target] = codec
      if (stat.isDirectory()) {
        const entries = readdirSync(path)
        const sortedEntries = sortBy(entries, (entry) => entry)
        for (const entry of sortedEntries) {
          if (entry.startsWith(".")) continue
          helper(join(path, entry))
        }
      }
    }
    helper(root)
  }

  collate() {
    this.collateEntries()
    this.collateInputs()
  }

  collectMetadata() {
    for (const [_, codec] of Object.entries(this.outputs))
      try {
        codec.collectMetadata()
      } catch (e) {
        console.error("ssg: metadata:", codec.path, "error:", e)
      }
  }

  collateEntries() {
    for (const [_, codec] of Object.entries(this.outputs))
      codec.collateEntries()
    for (const [_, codec] of Object.entries(this.outputs)) codec.entry?.order()
  }

  collateInputs() {
    for (const [_, codec] of Object.entries(this.outputs)) codec.collateInputs()
  }

  insertEntry(path: string[], codec: Codec) {
    if (isEqual(path, [""])) {
      this.root = new Entry(null, null, codec)
    } else {
      this.root?.insertEntry(path, codec)
    }
  }

  render(path: string): {
    content?: Buffer | string
    yaml?: any
    type?: string
    status?: number
  } {
    const entry = this.outputs[path]
    if (!entry) return { content: "Not found" }
    return entry.render()
  }

  async generate() {
    for (let path of Object.keys(this.outputs)) {
      const entry = this.outputs[path]
      if (!entry) return
      const result = { path, type: "text/html", status: 200, ...entry.render() }
      if (result.status !== 200) continue
      if (!result.content) continue
      if (!path.includes(".")) {
        path = path + "/index.html"
      }
      path = "docs/" + path
      path = path.replaceAll(/\/+/g, "/")
      mkdirSync(dirname(path), { recursive: true })
      if (typeof result.content === "string" && result.type === "text/html") {
        result.content = await minify(result.content, {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
        })
        result.content = await prettier.format(result.content, { parser: "html" })
      }
      writeFileSync(path, result.content)
    }
  }
}

function pre(...data: any) {
  return renderToString(<pre>{YAML.stringify(data)}</pre>)
}
