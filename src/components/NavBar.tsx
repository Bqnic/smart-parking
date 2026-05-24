import { Link, useLocation } from "react-router-dom";

export const NavBar: React.FC = () => {
	const location = useLocation();

	const linkStyles = (path: string) =>
		`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
			location.pathname === path
				? "bg-white text-gray-900 shadow-sm"
				: "text-gray-600 hover:text-gray-900 hover:bg-white/60"
		}`;

	return (
		<header className="w-full border-b border-gray-200 bg-gray-50/80 backdrop-blur">
			<nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
				<div className="text-lg font-semibold tracking-tight text-gray-900">
					ParkSmartZg
				</div>

				<div className="flex items-center gap-2 rounded-2xl bg-gray-100 p-1">
					<Link to="/" className={linkStyles("/")}>
						Home
					</Link>

					<Link to="/parking" className={linkStyles("/parking")}>
						Parking
					</Link>
				</div>
			</nav>
		</header>
	);
};
