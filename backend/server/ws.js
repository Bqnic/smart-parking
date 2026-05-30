const WebSocket = require("ws");

function startWebsockets(server) {
	const wss = new WebSocket.Server({ server });

	wss.on("connection", () => {
		console.log("Frontend connected");
	});

	return wss;
}

module.exports = startWebsockets;
