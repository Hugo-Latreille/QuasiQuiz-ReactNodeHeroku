import { useContext, useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { UserContext } from "../App";
import { axiosJWT } from "./axios";

const useAxiosJWT = () => {
	const refresh = useRefreshToken();
	const { user } = useContext(UserContext);

	useEffect(() => {
		const requestIntercept = axiosJWT.interceptors.request.use(
			(config) => {
				if (!config.headers["Authorization"]) {
					config.headers["Authorization"] = `Bearer ${user?.token}`;
				}
				return config;
			},
			(error) => Promise.reject(error)
		);

		const responseIntercept = axiosJWT.interceptors.response.use(
			(response) => response,
			async (error) => {
				const prevRequest = error?.config;
				if (error?.response?.status === 401 && !prevRequest?.sent) {
					prevRequest.sent = true;
					const newAccessToken = await refresh();
					prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
					return axiosJWT(prevRequest);
				}
				return Promise.reject(error);
			}
		);

		return () => {
			axiosJWT.interceptors.request.eject(requestIntercept);
			axiosJWT.interceptors.response.eject(responseIntercept);
		};
	}, [user, refresh]);

	return axiosJWT;
};

export default useAxiosJWT;
