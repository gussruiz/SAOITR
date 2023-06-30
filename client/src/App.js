import Register from "./Pages/Register/Register";
import Login from "./Pages/Login/Login";
import Layout from "./components/Layout";
import Home from "./Pages/Home/Home";
import Profile from "./Pages/Profile/Profile";

import { Routes, Route } from "react-router-dom";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route path="" element={<Home />} />
				<Route path="login" element={<Login />} />
				<Route path="register" element={<Register />} />
				<Route path="profile" element={<Profile />} />
			</Route>
		</Routes>
	);
}

export default App;
