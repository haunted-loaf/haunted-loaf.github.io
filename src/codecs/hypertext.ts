import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, parse } from "node:path";
import { Environment, FileSystemLoader } from "nunjucks";

import { Codec } from "./codec";
import { Entry } from "../entry";
import { inspect } from "node:util";

function render(content: string, entry: Entry) {
	const context = {
		content,
		entry,
	};
	const env = new Environment(new FileSystemLoader(".", { noCache: true }));
	env.addFilter("dump", (object) => inspect(object));
	return env.render("layouts/default.njk", context);
}

export abstract class HypertextCodec extends Codec {
	abstract html: string;

	collateInputs() {
		super.collateInputs();
		this.inputs.push(parse(this.path).dir);
		this.inputs.push("layouts/default.njk");
	}

	generate() {
		mkdirSync(dirname(this.target), { recursive: true });
		const html = render(this.html, this.entry);
		writeFileSync(this.target, html);
	}
}
