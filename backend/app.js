const express = require("express");
const WebSocket = require("ws");

const startMqtt = require("./mqtt-subscriber.js");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

startMqtt("intstv26_parking/out/testFERparking", onParkingStatusMessage);
const wss = new WebSocket.Server({ port: 8080 });

/**
 * On receiving message from MQTT broker, send message via WebSockets to client.
 * @param {string} message
 */
function onParkingStatusMessage(message) {
	console.log(message);

	wss.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(data);
		}
	});
}
