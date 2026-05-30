import { ParkingSpotStatus } from "../../types/parking-spot.types";

interface ParkingSpotStyle {
	style: string;
	icon: string;
}

export const ParkingSpotConfig: Record<ParkingSpotStatus, ParkingSpotStyle> = {
	[ParkingSpotStatus.FREE]: {
		style: "bg-emerald-100 border-emerald-400 text-emerald-700",
		icon: "🟢",
	},
	[ParkingSpotStatus.OCCUPIED]: {
		style: "bg-red-100 border-red-400 text-red-700",
		icon: "🔴",
	},
	[ParkingSpotStatus.RESERVED]: {
		style: "bg-orange-100 border-orange-400 text-orange-700",
		icon: "🟠",
	},
};
