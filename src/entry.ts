import { sortBy } from "underscore"
import { Codec } from "./codecs/codec"
import { pathToTitle } from "./utils/titleCase"

export class Entry {
  constructor(
    public name: string | null,
    public up: Entry | null,
    public codec: Codec,
    public children: Entry[] = [],
    public map: Record<string, Entry> = {},
  ) {
    if (codec) codec.entry = this
  }

  insertEntry(path: string[], codec: Codec) {
    const name = path[0]
    if (path.length === 1) {
      const entry = new Entry(name, this, codec)
      entry.name = name
      codec.entry = entry
      this.map[name] = entry
      this.children.push(entry)
    } else {
      this.map[name].insertEntry(path.slice(1), codec)
    }
  }

  get is(): Record<string, boolean> {
    const it = this
    return new Proxy(
      {},
      {
        get(target, p, receiver) {
          return Object.hasOwn(it.codec.metadata, p)
        },
      },
    )
  }

  get top(): Entry {
    if (this.up) return this.up.top
    return this
  }

  get book(): Entry {
    if (this.codec.metadata.book) return this
    if (this.up) return this.up.book
    return this
  }

  get hidden() {
    return this.codec.metadata.hideInNavigation
  }

  get link() {
    return this.codec.target
      .replace(/^output\/?/, "/")
      .replace(/(?<=\/)index.html$/, "")
  }

  get basename() {
    const res = this.link.replace(/\/$/, "").split("/").pop()
    return res ? res : "home"
  }

  get ancestors(): Entry[] {
    return this.up ? [...this.up.ancestors, this.up] : []
  }

  get title() {
    if (this.codec.metadata.title) return this.codec.metadata.title
    if (this.link === "/") return "Home"
    return pathToTitle(this.link)
  }

  get sorted_children() {
    return sortBy(this.children, (c) => {
      const numbers = c.name?.match(/(^[0-9]+)(.*)/)
      if (numbers) return BigInt(numbers[1])
      if (c.codec.metadata.order) return c.codec.metadata.order;
      return Infinity
    })
  }

  order() {
    this.children = this.sorted_children
  }

  find(path: string[]): Entry | null {
    if (path.length === 0) return this
    const [name, ...rest] = path
    if (this.map[name]) return this.map[name].find(rest)
    return null
  }
}
