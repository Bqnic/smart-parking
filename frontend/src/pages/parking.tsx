import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

import { ParkingMap } from "../components/parking-map/parking-map";
import { GoogleMapWrapper } from "../components/google-map/google-map-wrapper";

import { parkingStore } from "../stores/parking-store";
import { ParkingLocation, PARKINGS } from "../types/parking-location.types";

import { AnalyticsPanel } from "../components/analytics-panel";

export const Parking: React.FC = observer(() => {
  const { freeSpotsCount, updateParkingLocation, activeLocation } =
    parkingStore;

  const [selectedParking, setSelectedParking] =
    useState<ParkingLocation>(activeLocation);

  function changeParkingLocation(newLocation: ParkingLocation) {
    updateParkingLocation(newLocation);
    setSelectedParking(newLocation);
  }

  const address = PARKINGS[selectedParking].address;

  useEffect(() => {
    parkingStore.loadInitialState();
    parkingStore.loadPeakHours();
  }, []);

  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-7xl flex-col px-4 py-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Parking</h1>

        <span className="text-sm text-gray-500">
          Praćenje u stvarnom vremenu
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Parking mapa */}
        <section className="lg:col-span-3 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Tlocrt parkinga
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Klikni na slobodno mjesto za rezervaciju.
            </p>
          </div>

          <div className="h-[50vh] min-h-[350px] max-h-[650px]">
            <ParkingMap />
          </div>
        </section>

        {/* Info panel */}
        <aside className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Parking lokacija
              </label>

              <select
                value={selectedParking}
                onChange={(e) =>
                  changeParkingLocation(e.target.value as ParkingLocation)
                }
                className="w-full rounded-xl border border-gray-300 px-3 py-2"
              >
                {Object.values(ParkingLocation).map((parking) => (
                  <option key={parking} value={parking}>
                    {PARKINGS[parking].displayName}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Lokacija
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {PARKINGS[selectedParking].displayName}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Adresa
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900 break-words">
                {address}
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-xs uppercase tracking-wide text-emerald-700">
                Slobodnih mjesta
              </p>

              <p className="mt-2 text-5xl font-bold text-emerald-600">
                {freeSpotsCount}
              </p>
            </div>
          </div>
        </aside>
      </div>

      <section className="mt-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
        <AnalyticsPanel />
      </section>

      <section className="mt-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Lokacija na karti
        </h2>

        <GoogleMapWrapper address={address} />
      </section>
    </main>
  );
});
