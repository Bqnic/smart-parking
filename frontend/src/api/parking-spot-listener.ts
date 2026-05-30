const ws = new WebSocket("ws://localhost:8080");

ws.onopen = () => {
	console.log("Connected");
};

ws.onclose = () => {
	console.log("Closed");
};

ws.onerror = (err) => {
	console.error("WS error", err);
};

ws.onmessage = (event) => {
	const data = JSON.parse(event.data);
	console.log(data);
};
