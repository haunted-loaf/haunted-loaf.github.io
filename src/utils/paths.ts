export function splitPath(path: string) {
  path = path.replace(/\/$/, "").replace(/^\//, "")
  if (path === "") return []
  return path.split("/")
}
