import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import Layout from "./components/Layout";
import Admin from "./components/Admin";
import Missing from "./components/Missing";
import Unauthorized from "./components/Unauthorized";
import LinkPage from "./components/LinkPage";
import RequireAuth from "./components/RequireAuth";

import { Routes, Route } from "react-router-dom";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				{/* public routes */}
				<Route path="login" element={<Login />} />
				<Route path="register" element={<Register />} />
				<Route path="linkpage" element={<LinkPage />} />
				<Route path="unauthorized" element={<Unauthorized />} />

				{/* we want to protect these routes */}
				<Route element={<RequireAuth/>}>
					<Route path="/" element={<Home />} />
				</Route>

				<Route element={<RequireAuth/>}>
					<Route path="admin" element={<Admin />} />
				</Route>

				{/* catch all */}
				<Route path="*" element={<Missing/>}/>
			</Route>
		</Routes>
	);
}

export default App;
