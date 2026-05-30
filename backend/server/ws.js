const WebSocket = require("ws");

function startWebsockets(port) {
	const wss = new WebSocket.Server({ port: 8080 });

	wss.on("connection", () => {
		console.log("Frontend connected");
	});

	return wss;
}

module.exports = startWebsockets;
