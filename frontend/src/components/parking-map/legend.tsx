import { ParkingSpotConfig } from "./parking-map-types";

export const Legend = () => (
	<div className="flex items-center gap-4 px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm text-xs font-medium">
		{Object.entries(ParkingSpotConfig).map(([status, cfg]) => (
			<span key={status} className="flex items-center gap-1.5">
				<span
					className="inline-block w-2.5 h-2.5 rounded-full"
					style={{ background: cfg.stroke }}
				/>
				<span className="text-slate-600">{cfg.label}</span>
			</span>
		))}
	</div>
);
