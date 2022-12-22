import Header from "../../Layouts/Header";
import Footer from "../../Layouts/Footer";
import Button from "../../Components/Button/Button";
import "./_lobby.scss";
import { useContext, useEffect } from "react";
import useAxiosJWT from "../../utils/useAxiosJWT";
import {
	gameHasUsersRoute,
	gamesRoute,
	host,
	mercureHubUrl,
	usersRoute,
} from "../../utils/axios";
import { UserContext } from "../../App";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
//? React Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Message from "../Message/Message";
import Lobbyskel from "../Skeleton/LobbySkel";

const Lobby = () => {
	const axiosJWT = useAxiosJWT();
	const { user } = useContext(UserContext);
	const [gameId, setGameId] = useState(null);
	const [otherUsers, setOtherUsers] = useState(null);
	const [userId, setUserId] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();
	const players = otherUsers?.filter(
		(otherUser) => otherUser.isGameMaster === false
	);

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const isGameOpen = async () => {
			try {
				const { data: userData } = await axiosJWT.get(
					`${usersRoute}?email=${user.email}`,
					{
						headers: { Authorization: `Bearer ${user.token}` },
						signal: controller.signal,
					}
				);
				const userId = userData["hydra:member"][0].id;
				setUserId(userId);

				const { data } = await axiosJWT.get(`${gamesRoute}?is_open=true`, {
					signal: controller.signal,
				});
				if (isMounted && data) {
					if (data["hydra:member"].length === 0) {
						// si pas de partie, on en créé une,  is_open true, et on y ajoute l'utilisateur en tant que MJ

						const { data: newGame } = await axiosJWT.post(gamesRoute, {
							isOpen: true,
						});

						await axiosJWT.post(gameHasUsersRoute, {
							game: `/api/games/${newGame.id}`,
							userId: `/api/users/${userId}`,
							isGameMaster: true,
						});
						setGameId(newGame.id);
						return console.log("Partie créée");
					}
					const thisGame = data["hydra:member"][0];

					setGameId(data["hydra:member"][0].id);

					// - Si une game est ouverte, et qu'il n'en fait pas déjà partie, on ajoute l'utilisateur à cette game
					// On vérifie si game_has_user ne contient pas déjà l'utilisateur pour la partie en cours
					const isUserAlreadyGame = thisGame?.gameHasUsers
						.map((gameHasUser) =>
							gameHasUser.userId.includes(`api/users/${userId}`)
						)
						.some((value) => value === true);

					//Si l'utilisateur n'est pas dans game existante, on l'ajoute
					if (!isUserAlreadyGame) {
						const { data: addUserInGame } = await axiosJWT.post(
							gameHasUsersRoute,
							{
								game: `/api/games/${data["hydra:member"][0].id}`,
								userId: `/api/users/${userId}`,
								isGameMaster: false,
							}
						);

						console.log(addUserInGame);
					}
				}
			} catch (error) {
				console.log(error);
			}
		};
		isGameOpen();
		setIsLoading(false);

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, []);

	// on récupère tous les utilisateurs de GHU pour cette partie, on stock pseudo/img/MJ, on map pour afficher
	useEffect(() => {
		// console.log("ICIIIIIIIIIIIIIII", gameId);
		let isMounted = true;
		const controller = new AbortController();
		const getGameUsers = async () => {
			try {
				if (gameId) {
					const { data: usersInGame } = await axiosJWT.get(
						`${gameHasUsersRoute}?game=${gameId}`,
						{
							signal: controller.signal,
						}
					);
					if (isMounted && usersInGame) {
						const allGameUsers = usersInGame["hydra:member"];

						const allOtherUsers = allGameUsers
							// ?.filter((gameUser) => gameUser.userId.email !== user.email)
							.map((user) => ({
								id: user.userId.id,
								pseudo: user.userId.pseudo,
								avatar: user.userId.avatar,
								email: user.userId.email,
								isGameMaster: user.is_game_master,
							}));

						console.log(allOtherUsers);
						setOtherUsers(allOtherUsers);
					}
				}
			} catch (error) {
				console.log(error);
			}
		};
		getGameUsers();

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, [gameId]);

	useEffect(() => {
		const url = new URL(mercureHubUrl);
		url.searchParams.append("topic", `${host}${gameHasUsersRoute}/{id}`);
		url.searchParams.append("topic", `${host}${gamesRoute}/{id}`);
		const eventSource = new EventSource(url);
		eventSource.onmessage = (e) => {
			console.log(JSON.parse(e.data));
			const data = JSON.parse(e.data);

			if (
				data["@context"].includes("GameHasUser") &&
				otherUsers &&
				userId !== data.userId.id
			) {
				console.log(userId, data.userId.id);
				console.log("UserEvent", data);
				return setOtherUsers((prev) => [
					...prev,
					{
						id: data.userId.id,
						pseudo: data.userId.pseudo,
						avatar: data.userId.avatar,
						email: data.userId.email,
						isGameMaster: data.is_game_master,
					},
				]);
			}
			if (
				data["@context"].includes("Game") &&
				!data["@context"].includes("GameHasUser")
			) {
				if (data.is_open === false) {
					console.log("GameEvent", data);
					return navigate(`/game/${gameId}`);
				}
			}
		};

		return () => {
			eventSource.close();
		};
	}, [otherUsers]);

	// 3-si GM, affichage bouton partie et au lancement, le game devient fermée, on appelle la route générant les questions, navigate vers question / pour les autres joueurs, bouton "rejoindre la partie"

	const isUserGameMaster = () => {
		return otherUsers?.filter(
			(otherUser) =>
				(otherUser.isGameMaster === true) & (otherUser.email === user.email)
		).length === 1
			? true
			: false;
	};

	// /game/{GameId<\d+>}/questions/{nbrOfQuestions<\d+>

	const handleGame = async (e) => {
		e.preventDefault();

		if (isUserGameMaster()) {
			await axiosJWT.patch(
				`${gamesRoute}/${gameId}`,
				{
					isOpen: false,
				},
				{ headers: { "Content-Type": "application/merge-patch+json" } }
			);

			await axiosJWT.get(`/game/${gameId}/questions`);
			return navigate(`/game/${gameId}`);
		}

		const { data: isGameOpen } = await axiosJWT.get(`${gamesRoute}/${gameId}`);

		//si game encore ouverte, toast "Veuillez attendre que le MJ"...
		if (isGameOpen.is_open === true) {
			return toast.info(
				"Veuillez attendre que le Maître du Jeu lance la partie",
				toastOptions
			);
		}
		return navigate(`/game/${gameId}`);
	};
	const toastOptions = {
		position: "top-right",
		autoClose: 6000,
		pauseOnHover: true,
		draggable: true,
		theme: "dark",
	};

	return (
		<>
			{isLoading ? (
				<Lobbyskel />
			) : (
				<>
					<Header />
					<main>
						<div className="lobby-content">
							<div className="lobby-title">
								<h1>La partie va bientôt commencer !</h1>
							</div>
							<div className="lobby-gamer">
								<div className="lobby-gamer-boxes">
									<div className="gm-box">
										{isUserGameMaster() ? (
											<h4>Vous êtes le maître du jeu !</h4>
										) : (
											<h4>Vous lui devez allégeance !</h4>
										)}
										<div className="gm-card">
											{otherUsers &&
												otherUsers
													?.filter(
														(otherUser) => otherUser.isGameMaster === true
													)
													.map((otherUser) => (
														<div key={otherUser.id} className="gamer-img">
															<img
																src={`data:image/svg+xml;base64,${otherUser.avatar}`}
																alt=""
															/>
															<h3>{otherUser.pseudo}</h3>
														</div>
													))}
										</div>
									</div>
									{otherUsers && players.length > 0 && (
										<div className="gamer-box">
											<h4>Joueur présents :</h4>
											<div className="gc-grid">
												{otherUsers &&
													players.map((otherUser) => (
														<div key={otherUser?.id} className="gamer-card">
															<div
																className={
																	otherUser.email === user.email
																		? "gamer-img user"
																		: "gamer-img"
																}
															>
																<img
																	src={`data:image/svg+xml;base64,${otherUser?.avatar}`}
																	alt=""
																/>
															</div>
															<h3>{otherUser?.pseudo}</h3>
														</div>
													))}
											</div>
										</div>
									)}
								</div>

								<div className="legend">
									{isUserGameMaster() === false && (
										<ul>
											<li id="gm-color">Le MJ</li>
											<li id="g-color">Les Autres</li>
											<li id="user-color">Vous</li>
										</ul>
									)}
								</div>
							</div>
							{/* {otherUsers && isUserGameMaster() ? (
						<Button onClick={handleGame} label={"Lancer la partie"} />
					) : (
						<Button onClick={handleGame} label={"Rejoindre la partie"} />
					)} */}
							{otherUsers && isUserGameMaster() && (
								<Button onClick={handleGame} label={"Lancer la partie"} />
							)}
						</div>
					</main>
					<Message gameId={gameId} userId={userId} />
					<Footer />
					<ToastContainer />{" "}
				</>
			)}
		</>
	);
};

export default Lobby;
