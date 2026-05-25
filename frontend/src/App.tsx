import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Home } from "./pages/Home";
import { Parking } from "./pages/Parking";
import { NavBar } from "./components/NavBar";

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
