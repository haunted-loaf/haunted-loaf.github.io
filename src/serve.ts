import liveServer, { LiveServerParams } from "live-server";

export async function serve() {
	const params: LiveServerParams = {
		// port: 8181, // Set the server port. Defaults to 8080.
		root: "output", // Set root directory that's being served. Defaults to cwd.
		open: false, // When false, it won't load your browser by default.
		file: "404.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
		wait: 250, // Waits for all changes, before reloading. Defaults to 0 sec.
		logLevel: 1, // 0 = errors only, 1 = some, 2 = lots
    ignore: "*",
		// middleware: [function(req, res, next) { next(); }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
	} as const;
	liveServer.start(params);
}

serve();
