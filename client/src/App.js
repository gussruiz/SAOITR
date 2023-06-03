import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Layout from "./components/Layout";
import LinkPage from "./components/Home/Home";

import { Routes, Route } from "react-router-dom";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				{/* public routes */}
				<Route path="" element={<LinkPage />} />
				<Route path="login" element={<Login />} />
				<Route path="register" element={<Register />} />
			</Route>
		</Routes>
	);
}

export default App;
