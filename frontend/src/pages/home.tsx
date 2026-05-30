import { Link } from "react-router-dom";

export const Home: React.FC = () => {
	return (
		<main className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-6 text-center">
			<div className="max-w-xl">
				<h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
					ParkSmartZg
				</h1>

				<p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">
					Pametno parkiranje u Zagrebu bez stresa. Brzo pronađi,
					rezerviraj i upravljaj svojim parking mjestom u nekoliko
					klikova.
				</p>

				<Link
					to="/parking"
					className="mt-8 inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:bg-emerald-600 hover:shadow-xl"
				>
					Rezerviraj mjesto →
				</Link>
			</div>
		</main>
	);
};
