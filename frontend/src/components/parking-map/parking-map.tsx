import { observer } from "mobx-react-lite";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useState } from "react";
import { parkingStore } from "../../stores/parking-store";
import {
  type ParkingSpot,
} from "../../types/parking-spot.types";
import { Legend } from "./legend";
import { ParkingSpotShape } from "./parking-spot-shape";
import { SelectedSpotDialog } from "./selected-spot-dialog";

export const ParkingMap = observer(() => {
  const { parkingSpots, freeSpotsCount, positionedSpots } = parkingStore;
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const isMobile = window.innerWidth < 768;

  console.log(parkingSpots);

  const handleSpotClick = (spot: ParkingSpot) => {
    setSelectedSpot((prev) => (prev?.id === spot.id ? null : spot));
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-green-600">
              {freeSpotsCount}
            </span>{" "}
            od {parkingSpots.length} mjesta slobodno
          </p>
        </div>
        <Legend />
      </div>

      {/* Map */}
      <div className="relative flex-1 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden shadow-inner">
        <TransformWrapper
          centerOnInit
          limitToBounds
          centerZoomedOut
          initialScale={isMobile ? 1.3 : 0.95}
          minScale={0.95}
          maxScale={3}
          wheel={{
            step: 0.08,
          }}
          panning={{
            velocityDisabled: true,
          }}
        >
          <TransformComponent
            wrapperStyle={{ width: "100%", height: "100%" }}
            contentStyle={{ width: "100%", height: "100%" }}
          >
            <svg
              viewBox="0 0 1500 700"
              className="h-auto w-full"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* road 1 */}

              <rect x="40" y="190" width="1400" height="70" fill="#cbd5e1" />

              <line
                x1="40"
                y1="225"
                x2="1440"
                y2="225"
                stroke="white"
                strokeWidth="3"
                strokeDasharray="30,20"
              />

              {/* road 2 */}

              <rect x="40" y="410" width="1400" height="70" fill="#cbd5e1" />

              <line
                x1="40"
                y1="445"
                x2="1440"
                y2="445"
                stroke="white"
                strokeWidth="3"
                strokeDasharray="30,20"
              />

              {/* road 3 */}

              <rect x="40" y="630" width="1400" height="70" fill="#cbd5e1" />

              <line
                x1="40"
                y1="665"
                x2="1440"
                y2="665"
                stroke="white"
                strokeWidth="3"
                strokeDasharray="30,20"
              />

              {/* road between */}

              <rect
                x="715"
                y="0"
                width="70"
                height="700"
                rx="16"
                fill="#cbd5e1"
              />

              <line
                x1="750"
                y1="15"
                x2="750"
                y2="675"
                stroke="white"
                strokeWidth="3"
                strokeDasharray="30,20"
              />

              {/* Spots */}
              {positionedSpots.map((spot) => (
                <ParkingSpotShape
                  key={`${spot.location}${spot.id}`}
                  spot={spot}
                  isSelected={selectedSpot?.id === spot.id}
                  onClick={handleSpotClick}
                />
              ))}
            </svg>
          </TransformComponent>
        </TransformWrapper>
      </div>

      <SelectedSpotDialog
        selectedSpot={selectedSpot}
        setSelectedSpot={setSelectedSpot}
      />
    </div>
  );
});
