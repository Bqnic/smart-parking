const mqtt = require("mqtt");

function startMqtt(subscribeTopic, onMessageReceived) {
	const mqttClient = mqtt.connect({
		host: "djx.entlab.hr",
		port: 8883,
		protocol: "mqtt",
		username: process.env.MQTT_USERNAME,
		password: process.env.MQTT_PASSWORD,
	});

	mqttClient.on("connect", () => {
		console.log("Connected");

		mqttClient.subscribe(subscribeTopic, (err) => {
			if (err) console.log("Subscribed", err);
		});

		// Testing publish, remove later
		mqttClient.publish(
			"intstv26_parking/in/testFERparking",
			buildPayload(),
			(err) => {
				if (err) console.log("Published", err);
			},
		);
	});

	mqttClient.on("message", (topic, message) => {
		const data = message.toString();
		onMessageReceived(data);
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
}

// For testing publishing
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

module.exports = startMqtt;
