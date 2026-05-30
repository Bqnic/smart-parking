import { parkingStore } from "../stores/parking-store";
import type { ParkingSpot } from "../types/parking-spot.types";

const ws = new WebSocket(
	import.meta.env.VITE_SERVER_URL_WSS || "ws://localhost:8080",
);

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
	const parkingSpot: ParkingSpot = JSON.parse(event.data);
	console.log(parkingSpot);

	parkingStore.updateSpot(parkingSpot);
};
