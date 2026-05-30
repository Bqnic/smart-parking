const mqtt = require("mqtt");
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

const mqttClient = mqtt.connect({
	host: "djx.entlab.hr",
	port: 8883,
	protocol: "mqtt",
	username: process.env.MQTT_USERNAME,
	password: process.env.MQTT_PASSWORD,
});

mqttClient.on("connect", () => {
	console.log("Connected");

	mqttClient.subscribe(
		"intstv26_parking/out/testParkSmartZGREsource2026",
		(err) => {
			console.log("Subscribed", err);
		},
	);

	mqttClient.publish(
		"intstv26_parking/in/testParkSmartZGREsource2026",
		buildPayload(),
		(err) => {
			console.log("Published", err);
		},
	);
});

mqttClient.on("message", (topic, message) => {
	const data = message.toString();

	console.log(`Received: ${data}`);

	wss.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(data);
		}
	});
});

mqttClient.on("error", (err) => {
	console.error("MQTT error:", err);
});

mqttClient.on("close", () => {
	console.log("MQTT closed");
});

mqttClient.on("offline", () => {
	console.log("MQTT offline");
});

mqttClient.on("reconnect", () => {
	console.log("MQTT reconnecting");
});

function buildPayload() {
	return JSON.stringify({
		contentNodes: [
			{
				source: {
					resource: "testParkSmartZGResource2026-status",
				},

				value: 1,

				time: new Date().toISOString(),
			},
		],
	});
}
