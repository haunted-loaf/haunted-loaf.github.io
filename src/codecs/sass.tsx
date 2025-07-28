import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { FileCodec } from "./file"
import { dirname } from "node:path"
import { compile } from "sass"

export class SassCodec extends FileCodec {
  get target() {
    return super.target.replace(/.(sass|scss)$/, ".css")
  }

  private realGenerate(source: string) {
    const result = compile(this.path, {})
    this.inputs = [this.path, ...result.loadedUrls.map((u) => u.toString())]
    return result.css
  }

  render() {
    const source = readFileSync(this.path).toString()
    const content = this.realGenerate(source)
    return { content, type: "text/css" }
  }

  generate() {
    if (this.name.startsWith("_")) return
    const source = readFileSync(this.path).toString()
    const content = this.realGenerate(source)
    mkdirSync(dirname(this.target), { recursive: true })
    writeFileSync(this.target, content!)
  }
}
