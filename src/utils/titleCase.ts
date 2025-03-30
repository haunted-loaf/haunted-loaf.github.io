import { apStyleTitleCase } from "ap-style-title-case";
import { parse } from "node:path";

export function pathToTitle(path: string) {
	const name = parse(path).name.replace(/^[0-9]+[ -]?/, "");
	return apStyleTitleCase(name);
}
