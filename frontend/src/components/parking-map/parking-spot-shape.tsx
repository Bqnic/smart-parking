import {
	ParkingSpotStatus,
	ParkingSpotRamp,
	type ParkingSpot,
} from "../../types/parking-spot.types";
import { ParkingSpotConfig } from "./parking-map-types";

interface Props {
	spot: ParkingSpot;
	isSelected: boolean;
	onClick: (spot: ParkingSpot) => void;
	onHover: (spot: ParkingSpot | null) => void;
}

export const ParkingSpotShape = ({
	spot,
	isSelected,
	onClick,
	onHover,
}: Props) => {
	const cfg = ParkingSpotConfig[spot.status];
	const isFree = spot.status === ParkingSpotStatus.FREE;

	return (
		<g
			onClick={() => onClick(spot)}
			onMouseEnter={() => onHover(spot)}
			onMouseLeave={() => onHover(null)}
			style={{ cursor: isFree ? "pointer" : "default" }}
		>
			{/* Outer glow when selected */}
			{isSelected && (
				<rect
					x={spot.x - 5}
					y={spot.y - 5}
					width={150}
					height={100}
					rx={14}
					fill={cfg.stroke}
					opacity={0.15}
				/>
			)}

			{/* Spot body */}
			<rect
				x={spot.x}
				y={spot.y}
				width={140}
				height={90}
				rx={10}
				fill={cfg.fill}
				stroke={cfg.stroke}
				strokeWidth={isSelected ? 3 : 2}
			/>

			{/* Dashed parking lines */}
			<line
				x1={spot.x + 2}
				y1={spot.y + 45}
				x2={spot.x + 138}
				y2={spot.y + 45}
				stroke={cfg.stroke}
				strokeWidth={1}
				strokeDasharray="6,5"
				opacity={0.3}
			/>

			{/* Status indicator dot */}
			<circle cx={spot.x + 16} cy={spot.y + 16} r={7} fill={cfg.stroke} />
			{isFree && (
				<circle
					cx={spot.x + 16}
					cy={spot.y + 16}
					r={11}
					fill="none"
					stroke={cfg.stroke}
					strokeWidth={1.5}
					opacity={0.4}
				/>
			)}

			{/* Spot ID */}
			<text
				x={spot.x + 70}
				y={spot.y + 52}
				textAnchor="middle"
				fontSize="22"
				fontWeight="800"
				fill={cfg.text}
				fontFamily="'DM Sans', sans-serif"
				letterSpacing="-0.5"
			>
				{spot.id}
			</text>

			{/* Distance badge */}
			<rect
				x={spot.x + 92}
				y={spot.y + 8}
				width={38}
				height={16}
				rx={5}
				fill={cfg.stroke}
				opacity={0.15}
			/>
			<text
				x={spot.x + 111}
				y={spot.y + 20}
				textAnchor="middle"
				fontSize="9"
				fontWeight="700"
				fill={cfg.text}
				fontFamily="'DM Sans', sans-serif"
			>
				{spot.distance}m
			</text>

			{/* Ramp arrow */}
			<text
				x={spot.x + 70}
				y={spot.y + 80}
				textAnchor="middle"
				fontSize="11"
				fill={cfg.text}
				opacity={0.5}
				fontFamily="'DM Sans', sans-serif"
			>
				{spot.ramp === ParkingSpotRamp.UP ? "↑ Ramp up" : "↓ Ramp down"}
			</text>
		</g>
	);
};
