import { readdirSync, statSync } from "node:fs";
import { extname, join, parse } from "node:path";
import { Entry } from "./entry.js";
import {
	Codec,
	DirectoryCodec,
	FileCodec,
	MarkdownCodec,
	SassCodec,
} from "./codecs/index.js";
import { setTimeout } from "node:timers/promises";

export class Generator {
	roots: string[] = [];
	inputs: Record<string, Codec[]> = {};
	outputs: Record<string, Codec> = {};
	root?: Entry;

	#codecFor(path: string, root: string) {
		if (statSync(path).isDirectory()) {
			return new DirectoryCodec(this, path, root);
		}
		if (extname(path) === ".md") {
			return new MarkdownCodec(this, path, root);
		}
		if (extname(path) === ".scss") {
			return new SassCodec(this, path, root);
		}
		return new FileCodec(this, path, root);
	}

	scan(root: string) {
		const helper = (path: string) => {
			const stat = statSync(path);
			if (!stat.isDirectory() && !stat.isFile()) return;
			const codec = this.#codecFor(path, root);
			this.outputs[codec.target] = codec;
			if (stat.isDirectory()) {
				for (const entry of readdirSync(path)) {
					if (entry.startsWith(".")) continue;
					helper(join(path, entry));
				}
			}
		};
		this.roots.push(root);
		helper(root);
	}

	collate() {
		this.collateEntries();
		this.collateInputs();
	}

	collectMetadata() {
		for (const [_, codec] of Object.entries(this.outputs))
			try {
				codec.collectMetadata();
			} catch (e) {
				console.error("ssg: metadata:", codec.path, "error:", e);
			}
	}

	collateEntries() {
		for (const [_, codec] of Object.entries(this.outputs))
			codec.collateEntries();
		for (const [_, codec] of Object.entries(this.outputs)) codec.entry?.order();
	}

	collateInputs() {
		for (const [_, codec] of Object.entries(this.outputs))
			codec.collateInputs();
		// for (const input of codec.inputs) (this.inputs[input] ??= []).push("!");
	}

	insertEntry(path: string[], codec: Codec) {
		if (path.at(-1) === "index.html") path.splice(-1, 1);
		if (path.length === 0) {
			this.root = new Entry(null, null, codec);
		} else {
			this.root?.insertEntry(path, codec);
		}
	}

	generate(force = false) {
		for (const output of Object.values(this.outputs)) {
			if (force || output.dirty) {
				console.log("ssg: generating:", output.target);
				try {
					output.generate();
				} catch (e) {
					console.error("ssg: generating:", output.target, "error:", e);
				}
			}
		}
	}
}
