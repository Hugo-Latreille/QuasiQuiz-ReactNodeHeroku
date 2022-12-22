import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App";

const RequireAuth = () => {
	const { user } = useContext(UserContext);
	const token = user?.token;
	const location = useLocation();
	console.log("REQUIRE AUTH", user);

	return token ? (
		<Outlet />
	) : (
		<Navigate to="/" state={{ from: location }} replace />
	);
};
export default RequireAuth;
