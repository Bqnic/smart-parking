import {
  ParkingSpotStatus,
  ParkingSpotRamp,
  type ParkingSpot,
} from "../../types/parking-spot.types";
import { ParkingSpotConfig, type PositionedSpot } from "./parking-map-types";

interface Props {
  spot: PositionedSpot;
  isSelected: boolean;
  onClick: (spot: ParkingSpot) => void;
}

export const ParkingSpotShape = ({ spot, isSelected, onClick }: Props) => {
  const cfg =
    ParkingSpotConfig[spot.status] ?? ParkingSpotConfig[ParkingSpotStatus.FREE];

  return (
    <g
      onClick={() => onClick(spot)}
      style={{
        cursor:
          spot.status !== ParkingSpotStatus.OCCUPIED ? "pointer" : "default",
      }}
    >
      {/* Selection glow */}
      {isSelected && (
        <rect
          x={spot.x - 5}
          y={spot.y - 5}
          width={180}
          height={110}
          rx={14}
          fill={cfg.stroke}
          opacity={0.15}
        />
      )}

      {/* Body */}
      <rect
        x={spot.x}
        y={spot.y}
        width={170}
        height={100}
        rx={10}
        fill={cfg.fill}
        stroke={cfg.stroke}
        strokeWidth={isSelected ? 3 : 2}
      />

      {/* Status dot */}
      <circle cx={spot.x + 16} cy={spot.y + 16} r={10} fill={cfg.stroke} />

      {/* ID */}
      <text
        x={spot.x + 85}
        y={spot.y + 50}
        textAnchor="middle"
        fontSize="30"
        fontWeight="800"
        fill={cfg.text}
      >
        {spot.id}
      </text>

      {/* Ramp */}
      <text
        x={spot.x + 85}
        y={spot.y + 70}
        textAnchor="middle"
        fontSize="19"
        fontWeight={500}
        fill={cfg.text}
        opacity={1}
      >
        {spot.ramp === ParkingSpotRamp.UP
          ? "↑ Rampa dignuta"
          : "↓ Rampa spuštena"}
      </text>
    </g>
  );
};
