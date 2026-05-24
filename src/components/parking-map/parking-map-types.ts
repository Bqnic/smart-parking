type ParkingSpotStatus = "free" | "occupied" | "reserved";

interface ParkingSpotStyle {
	style: string;
	icon: string;
}

export const ParkingSpotConfig: Record<ParkingSpotStatus, ParkingSpotStyle> = {
	free: {
		style: "bg-emerald-100 border-emerald-400 text-emerald-700",
		icon: "🟢",
	},
	occupied: {
		style: "bg-red-100 border-red-400 text-red-700",
		icon: "🔴",
	},
	reserved: {
		style: "bg-orange-100 border-orange-400 text-orange-700",
		icon: "🟠",
	},
};

export interface ParkingSpot {
	id: string;
	status: ParkingSpotStatus;
}
