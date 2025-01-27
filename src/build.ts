import { Generator } from "./generator";

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
