import YAML from "yaml"
import { renderToString } from "react-dom/server"
import { withHtmlLiveReload } from "bun-html-live-reload"
import { serve } from "bun"
import { site } from "./watch"

const server = serve({
  routes: {},
  development: true,
  fetch: withHtmlLiveReload(async (req) => {
    const url = URL.parse(req.url)
    const path = url?.pathname ?? "/400"
    const result = { type: "text/html", status: 200, ...site.render(path) }
    const content =
      result.content || renderToString(<pre>{YAML.stringify(result.yaml)}</pre>)
    return new Response(content, {
      status: result.status,
      headers: {
        "Content-Type": result.type,
      },
    })
  }),
})

console.log(`Listening on ${server.url}`)
