// import MarkdownIt from "markdown-it";
// import MarkdownItTitle from "markdown-it-title";
// import MarkdownItMetadataBlock from "markdown-it-metadata-block";
// import MarkdownItWikiLinks from "markdown-it-wikilinks";

import { Metadata } from "../metadata";
// import { ParseFlags, parse } from "markdown-wasm";
import { marked } from "marked"
import markedFootnote from "marked-footnote"

marked.use(markedFootnote())

import matter from "gray-matter"

export function renderMarkdown(source: string, metadata: Metadata) {
  if (source === "")
    return ""
  const parsed = matter(source)
  const html = marked(parsed.content, {
  }) as string
  // const html = parse(parsed.content, {
  //   parseFlags:
  //     ParseFlags.DEFAULT |
  //     ParseFlags.LATEX_MATH_SPANS |
  //     ParseFlags.WIKI_LINKS |
  //     ParseFlags.STRIKETHROUGH |
  //     ParseFlags.NO_INDENTED_CODE_BLOCKS |
  //     ParseFlags.PERMISSIVE_URL_AUTO_LINKS,
  // });
  Object.assign(metadata, parsed.data)
  return html;
}
