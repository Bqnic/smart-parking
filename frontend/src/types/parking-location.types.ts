interface ParkingLocationInfo {
	displayName: string;
	address: string;
}

export enum ParkingLocation {
	FER = "FER",
	ARENA_CENTAR = "Arena_Centar",
}

export const PARKINGS: Record<ParkingLocation, ParkingLocationInfo> = {
	[ParkingLocation.FER]: {
		displayName: "FER",
		address: "24 Plitvička ul. Zagreb, Grad Zagreb",
	},
	[ParkingLocation.ARENA_CENTAR]: {
		displayName: "Arena Zagreb",
		address: "Ul. Vice Vukova 8, Zagreb, Croatia",
	},
};
