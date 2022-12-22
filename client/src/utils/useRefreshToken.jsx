import { useContext } from "react";
import axios, { refreshTokenRoute } from "./../utils/axios.js";
import { UserContext } from "../App";
import jwt_decode from "jwt-decode";

const useRefreshToken = () => {
	const { addUser } = useContext(UserContext);

	const refresh = async () => {
		const { data } = await axios.get(refreshTokenRoute);

		const decodedToken = jwt_decode(data.token);
		addUser({
			email: decodedToken.email,
			token: data.token,
			role: decodedToken.roles,
		});
		return data.token;
	};
	return refresh;
};

export default useRefreshToken;
