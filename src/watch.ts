import { Observable, debounce, debounceTime } from "rxjs"
import { Generator } from "./generator"
import { FSWatcher, watch, WatchEventType } from "fs"
import { reloadClients } from "bun-html-live-reload"
import { setTimeout } from "timers/promises"

if (!globalThis.watches) globalThis.watches = []

let pause = false
export const site = new Generator()

const changes = new Observable((subscriber) => {
  function handler(event: WatchEventType, path: string | null) {
    if (pause) return
    subscriber.next(path)
  }
  for (const watch of globalThis.watches) {
    watch.close()
  }
  globalThis.watches = []
  globalThis.watches.push(watch("content", { recursive: true }, handler))
  globalThis.watches.push(watch("layouts", { recursive: true }, handler))
}).pipe(debounceTime(10))

async function do_it() {
  try {
    pause = true
    site.reset()
    site.scan("content")
    site.collectMetadata()
    site.collate()
    await setTimeout(250)
    reloadClients()
  } finally {
    pause = false
  }
}

await do_it()

changes.subscribe(async () => {
  await do_it()
})
