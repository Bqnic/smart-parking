class ParkingSpotApi {
	private readonly api =
		import.meta.env.VITE_SERVER_URL_HTTPS || `http://localhost:3000`;

	reserve = async (parkingId: string) => {
		const res = await fetch(`${this.api}/reserve/${parkingId}`, {
			method: "POST",
		});

		if (!res.ok) {
			throw new Error(`Reservation failed: ${res.status}`);
		}

		return res.json();
	};
}

export const parkingSpotApi = new ParkingSpotApi();
