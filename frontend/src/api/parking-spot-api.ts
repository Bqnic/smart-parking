class ParkingSpotApi {
  private readonly api =
    import.meta.env.VITE_SERVER_URL_HTTPS || `http://localhost:3000`;

  reserve = async (parkingLocation: string, parkingId: string) => {
    const res = await fetch(
      `${this.api}/reserve/${parkingLocation}/${parkingId}`,
      {
        method: "POST",
      },
    );

    if (!res.ok) {
      throw new Error(`Reservation failed: ${res.status}`);
    }

    return res.json();
  };

  cancel = async (parkingLocation: string, parkingId: string) => {
    const res = await fetch(
      `${this.api}/cancel/${parkingLocation}/${parkingId}`,
      {
        method: "POST",
      },
    );

    if (!res.ok) {
      throw new Error(`Cancel failed: ${res.status}`);
    }

    return res.json();
  };

  getInitialState = async () => {
    const res = await fetch(`${this.api}/parking-state`);

    if (!res.ok) {
      throw new Error("Failed");
    }

    return res.json();
  };

  getPeakHours = async (location: string) => {
    const res = await fetch(`${this.api}/analytics/peak-hours/${location}`);

    if (!res.ok) {
      throw new Error("Failed loading peak hours");
    }

    return res.json();
  };
}

export const parkingSpotApi = new ParkingSpotApi();
