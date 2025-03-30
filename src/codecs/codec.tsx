import { renderToString } from "react-dom/server"
import { basename, dirname, join, parse } from "node:path"
import { pathToTitle } from "../utils/titleCase"
import { Generator } from "../generator"
import { Entry } from "../entry"
import { Metadata } from "../metadata"
import { existsSync, statSync } from "node:fs"

export abstract class Codec {
  metadata: Metadata
  entry!: Entry
  inputs: string[] = []
  name: string

  constructor(
    public generator: Generator,
    public path: string,
    public root: string
  ) {
    this.metadata = this.defaultMetadata
    this.name = parse(this.path).name
    if (this.name === "index") this.name = basename(dirname(this.path))
  }

  get defaultMetadata() {
    return {
      title: pathToTitle(this.path),
      order: 1,
    }
  }

  get target() {
    return join(this.path.slice(this.root.length))
  }

  get dirty() {
    try {
      const targetTime = statSync(this.target).mtimeMs
      return !this.inputs.every((p) => statSync(p).mtimeMs < targetTime)
    } catch {
      return true
    }
  }

  collectMetadata() {}

  collateEntries() {
    this.generator.insertEntry(
      this.target.replace(/^\//, "").replace(/\/$/, "").split("/"),
      this
    )
    if (this.name.startsWith("_")) this.metadata.hideInNavigation = true
  }

  collateInputs() {
    this.inputs = [this.path]
  }

  generate() {}

  render(): {
    content?: string | Buffer
    yaml?: any
    status?: number
    type?: string
  } {
    return {
      content: renderToString(
        <p>
          File <b>{this.path}</b> has no renderer.
        </p>
      ),
      status: 500,
      type: "text/html",
    }
  }
}
