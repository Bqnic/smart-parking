import { ParkingSpotStatus } from "../../types/parking-spot.types";

interface ParkingSpotStyle {
	label: string;
	badge: string;
	fill: string;
	stroke: string;
	text: string;
}

export const ParkingSpotConfig: Record<ParkingSpotStatus, ParkingSpotStyle> = {
	[ParkingSpotStatus.FREE]: {
		stroke: "#22c55e",
		fill: "#f0fdf4",
		text: "#15803d",
		label: "Free",
		badge: "bg-green-100 text-green-700",
	},
	[ParkingSpotStatus.OCCUPIED]: {
		stroke: "#ef4444",
		fill: "#fef2f2",
		text: "#b91c1c",
		label: "Occupied",
		badge: "bg-red-100 text-red-700",
	},
	[ParkingSpotStatus.RESERVED]: {
		stroke: "#f59e0b",
		fill: "#fffbeb",
		text: "#b45309",
		label: "Reserved",
		badge: "bg-amber-100 text-amber-700",
	},
};
