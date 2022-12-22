import { Link } from "react-router-dom";
import axios, { usersRoute, logoutToken } from "../../utils/axios";
import { useContext, useState } from "react";
import { UserContext } from "../../App";
import { useEffect } from "react";
import useRefreshToken from "../../utils/useRefreshToken";
import useAxiosJWT from "../../utils/useAxiosJWT";

const AuthTest = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [users, setUsers] = useState({});
	const refresh = useRefreshToken();
	const axiosJWT = useAxiosJWT();

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();
		const getUsers = async () => {
			try {
				const { data } = await axiosJWT.get(usersRoute, {
					signal: controller.signal,
				});
				if (data) {
					isMounted && setIsLoading(false);
				}
				setUsers(data["hydra:member"]);
			} catch (error) {
				console.log(error);
			}
		};
		getUsers();

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, []);

	const { removeUser } = useContext(UserContext);

	const handleLogout = async () => {
		await axios.get(logoutToken);
		removeUser();
	};

	return (
		<div>
			{isLoading && <p>Loading...</p>}
			{!isLoading && users?.map((user) => <p key={user.id}>{user.pseudo}</p>)}
			<Link to="/test">Back to Welcome</Link>
			<button onClick={handleLogout}>Logout</button>
			<button onClick={() => refresh()}>Refresh</button>
		</div>
	);
};
export default AuthTest;
