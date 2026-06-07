import { observer } from "mobx-react-lite";
import { parkingStore } from "../stores/parking-store";

export const AnalyticsPanel = observer(() => {
  const {
    freeSpotsCount,
    occupiedSpotsCount,
    reservedSpotsCount,
    occupancyPercentage,
    parkingFull,
  } = parkingStore;

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Analitika</h2>
      </div>

      {parkingFull && (
        <div className="mb-4 rounded-xl bg-red-500 p-3 text-white font-semibold">
          Parking je trenutno pun
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Metric label="Slobodnih mjesta" value={freeSpotsCount} />

        <Metric label="Zauzetih mjesta" value={occupiedSpotsCount} />

        <Metric label="Aktivne rezervacije" value={reservedSpotsCount} />

        <Metric label="Zauzetost" value={`${occupancyPercentage}%`} />
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Najviše dolazaka na parking po satu
        </h3>

        <div className="space-y-3">
          {parkingStore.peakHours.map((peak, index) => {
            const order = ["1. ", "2. ", "3. "];

            return (
              <div
                key={peak.hour}
                className="
            flex
            items-center
            justify-between
            rounded-lg
            bg-white
            px-4
            py-3
            shadow-sm
          "
              >
                <div>
                  <div className="font-medium text-slate-800">
                    {order[index]} {peak.hour}:00 - {peak.hour + 1}:00
                  </div>
                </div>

                <div className="text-lg font-bold text-orange-600">
                  {peak.occupiedEvents}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}
