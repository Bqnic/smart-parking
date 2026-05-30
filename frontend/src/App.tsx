import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Home } from "./pages/home";
import { Parking } from "./pages/parking";
import { NavBar } from "./components/nav-bar";

export const App: React.FC = () => {
	return (
		<BrowserRouter>
			<NavBar />

			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/parking" element={<Parking />} />
			</Routes>
		</BrowserRouter>
	);
};
