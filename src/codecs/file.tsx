import { copyFileSync, mkdirSync, readFileSync } from "node:fs"
import { dirname } from "node:path"

import { Codec } from "./codec"
import { lookup } from "mime-types"

export class FileCodec extends Codec {
  generate() {
    mkdirSync(dirname(this.target), { recursive: true })
    copyFileSync(this.path, this.target)
  }

  render(): {
    content?: string | Buffer
    yaml?: any
    status?: number
    type?: string
  } {
    const content = readFileSync(this.path)
    const type = lookup(this.path) || "application/octet-stream"
    return { content, type }
  }
}


