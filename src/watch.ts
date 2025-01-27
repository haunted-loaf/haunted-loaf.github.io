import { Observable, debounce, debounceTime } from "rxjs";
import { Generator } from "./generator";

import watcher from "@parcel/watcher";
import { readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";

function getPaths(dir: string): string[] {
	const entries = readdirSync(dir);
	const files = entries.map((entry) => {
		const res = resolve(dir, entry);
		return statSync(res).isDirectory() ? getPaths(res) : [res];
	});
	return files.reduce((a, f) => a.concat(f), []);
}

const changes = new Observable((subscriber) => {
	watcher.subscribe("content", (_, events) => {
		for (const event of events) {
			subscriber.next(event.path);
		}
	});
}).pipe(debounceTime(250));

async function do_it(force: boolean) {
	console.log("ssg: processing");
	const generator = new Generator();
	generator.scan("src/template");
	generator.scan("content");
	generator.collectMetadata();
	generator.collate();
	generator.generate(force);
	console.log("ssg: finished");
}

await do_it(true);
changes.subscribe(() => {
	console.log("ssg: change detected");
	do_it(false);
});
