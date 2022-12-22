/* eslint-disable no-unreachable */
import Header from "../../Layouts/Header";
import Footer from "../../Layouts/Footer";
import Button from "../../Components/Button/Button";

import "./_palmares.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosJWT, scoresRoute } from "../../utils/axios";

const Palmares = () => {
	const { gameId } = useParams();
	const [scores, setScores] = useState(null);
	const [count, setCount] = useState(0);

	//TODO si utilisateur = moi, alors signe distinctif

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();
		const getScores = async () => {
			try {
				const { data: gameScores } = await axiosJWT.get(
					`${scoresRoute}?order[score]=desc&game=${gameId}`,
					{
						signal: controller.signal,
					}
				);
				if (isMounted && gameScores) {
					console.log(gameScores["hydra:member"]);
					setScores(gameScores["hydra:member"]);
				}
			} catch (error) {
				console.log(error);
			}
		};

		getScores();

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, [gameId]);

	useEffect(() => {
		let counter = count;
		const interval = setInterval(() => {
			if (counter >= scores.length) {
				clearInterval(interval);
			} else {
				setCount((count) => count + 1);
				counter++;
			}
		}, 3000);

		return () => clearInterval(interval);
	}, [scores]);

	const scoresWithPosition = scores?.map((user, index) => ({
		...user,
		position: index + 1,
	}));

	const cssPosition = (position) => {
		switch (position) {
			case 1:
				return "g-result first";
				break;
			case 2:
				return "g-result second";
				break;
			case 3:
				return "g-result third";
				break;
			case scoresWithPosition.length:
				return "g-result last";
				break;
			default:
				return "g-result others";
		}
	};

	return (
		<>
			<Header />
			<main>
				<div className="palmares-content">
					<div className="title">
						<h1>Résultats</h1>
					</div>
					<div className="results-box">
						{scoresWithPosition
							?.slice(
								scoresWithPosition.length - count,
								scoresWithPosition.length
							)
							.map((user) => (
								<div key={user.position} className={cssPosition(user.position)}>
									<div className="gamer">
										<img
											src={`data:image/svg+xml;base64,${user.userId.avatar}`}
											alt=""
										/>
										<a href="#" className="pseudo">
											{user.userId.pseudo}
										</a>
									</div>
									<a href="#" className="pts">
										{user.score}pts
									</a>
									<a href="#" className="position">
										{user.position}
									</a>
								</div>
							))}
					</div>
					<Button label={"Rejouer"} />
				</div>
			</main>
			<Footer />
		</>
	);
};

export default Palmares;
