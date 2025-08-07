import { Generator } from "./generator";

async function do_it(force: boolean) {
	console.log("ssg: processing");
	const generator = new Generator();
	generator.scan("content");
	generator.collectMetadata();
	generator.collate();
	await generator.generate();
	console.log("ssg: finished");
}

await do_it(true);
