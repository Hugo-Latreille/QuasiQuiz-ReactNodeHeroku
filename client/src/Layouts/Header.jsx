import logo from "../assets/logo-full.svg";
import BlankAvatar from "../assets/Blank-Avatar.png";
import "./_header.scss";
import Button from "../Components/Button/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useRef } from "react";
import { UserContext } from "../App";
import axios, { logoutToken, usersRoute } from "../utils/axios";
import useAxiosJWT from "../utils/useAxiosJWT";
import { useEffect } from "react";
import { useState } from "react";

const Header = () => {
	const location = useLocation();
	const { user, removeUser } = useContext(UserContext);
	const axiosJWT = useAxiosJWT();
	const dropDown = useRef(null);
	const [avatar, setAvatar] = useState(null);
	const navigate = useNavigate();

	//** callback pour le dropdown */
	const dropdownFunc = () => {
		dropDown.current.classList.toggle("show");
	};
	// ** Désactiver le dropdown en cliquant n'importe où sur l'écran */

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropDown.current && !event.target.matches(".dropbtn")) {
				if (dropDown.current.classList.contains("show")) {
					dropDown.current.classList.remove("show");
				}
			}
		};
		document.addEventListener("click", handleClickOutside);
	}, [dropDown]);

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();
		const loadUser = async () => {
			try {
				if (user.token) {
					const { data: userData } = await axiosJWT.get(
						`${usersRoute}?email=${user.email}`,
						{
							headers: { Authorization: `Bearer ${user.token}` },
							signal: controller.signal,
						}
					);
					if (isMounted && userData) {
						setAvatar(userData["hydra:member"][0].avatar);
					}
				}
			} catch (error) {
				console.log(error);
			}
		};

		loadUser();

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, []);

	const handleLogout = async () => {
		const { data: userData } = await axiosJWT.get(
			`${usersRoute}?email=${user.email}`,
			{
				headers: { Authorization: `Bearer ${user.token}` },
			}
		);
		const userId = userData["hydra:member"][0].id;

		await axiosJWT.patch(
			`${usersRoute}/${userId}`,
			{
				isReady: false,
			},
			{ headers: { "Content-Type": "application/merge-patch+json" } }
		);

		await axios.get(logoutToken);
		removeUser();
	};

	const handleProfile = () => {
		console.log("coucou");
		navigate("/profil");
	};
	return (
		<>
			<div className="header">
				<Link to="/lobby">
					<img src={logo} alt="logoQuasiQuiz" className="logo" />
				</Link>

				{!user.token ? (
					<Link
						className="link-mod"
						to="login"
						state={{ background: location }}
					>
						<Button label="Connexion" />
					</Link>
				) : (
					<div className="dropdown">
						<img
							onClick={dropdownFunc}
							src={avatar ? `data:image/svg+xml;base64,${avatar}` : BlankAvatar}
							className="dropbtn"
						></img>
						<div id="myDropdown" className="dropdown-content" ref={dropDown}>
							<div className="list">
								<p className="profile" onClick={handleProfile}>
									Profil
								</p>
								<p className="logout" onClick={handleLogout}>
									Déconnexion
								</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default Header;
