import "./_game.scss";
import Header from "../../Layouts/Header";
import Footer from "../../Layouts/Footer";
import {
	axiosJWT,
	gameHasUsersRoute,
	gameQuestions,
	gamesRoute,
	host,
	mercureHubUrl,
	userAnswersRoute,
	usersRoute,
} from "../../utils/axios";
import { useContext, useEffect, useRef, useState } from "react";
import ProgressBar from "../../Components/ProgressBar/ProgressBar";
import { useNavigate, useParams } from "react-router-dom";
import Timer from "../../Components/Timer/Timer";
import { UserContext } from "../../App";
import Button from "../../Components/Button/Button";
//? React Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Message from "../Message/Message";
import { v4 as uuidv4 } from "uuid";
import Gameskel from "../Skeleton/GameSkel";

//? set FOCUS sur le champ de réponse (inputRef.current.focus())
const Game = () => {
	// on récupère gameId des paramètres de la route
	const { gameId } = useParams();
	const [questions, setQuestions] = useState([]);
	const [selectedQuestion, setSelectedQuestion] = useState(0);
	const [noMoreTime, setNoMoreTime] = useState(false);
	const [thisQuestion, setThisQuestion] = useState(null);
	const [remainingTime, setRemainingTime] = useState(null);
	const [time, setTime] = useState(null);
	const timerId = useRef();
	const timerRef = useRef(null);
	const inputRef = useRef(null);
	const isLastQuestion = selectedQuestion === questions.length;
	const { user } = useContext(UserContext);
	const [userId, setUserId] = useState(null);
	const [answer, setAnswer] = useState("");
	const [users, setUsers] = useState(null);
	const navigate = useNavigate();
	const btnRef = useRef();
	const [isLoading, setIsLoading] = useState(true);
	const [answersCount, setAnswerCount] = useState(0);

	//! soit ici dès que game corrigée, alors on move les users vers palmares
	//! SOIT correction : possible : passage écran suivant...ou animation. Possibilité d'afficher vrai/faux en direct ?? uniquement si patch bdd...

	// récuperer les questions de cette partie + le temps de chacune + le niveau
	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();
		const getQuestions = async () => {
			try {
				const { data: userData } = await axiosJWT.get(
					`${usersRoute}?email=${user.email}`,
					{
						signal: controller.signal,
					}
				);
				const userId = userData["hydra:member"][0].id;
				setUserId(userId);

				const { data: gameQuestion } = await axiosJWT.get(
					`${gameQuestions}?game=${gameId}`,
					{
						signal: controller.signal,
					}
				);
				if (isMounted && gameQuestion) {
					console.log(gameQuestion["hydra:member"]);
					setQuestions(gameQuestion["hydra:member"]);
				}
			} catch (error) {
				console.log(error);
			}
		};
		const getUsers = async () => {
			try {
				if (gameId) {
					const { data: usersInGame } = await axiosJWT.get(
						`${gameHasUsersRoute}?game=${gameId}`
					);
					if (usersInGame) {
						setUsers(usersInGame["hydra:member"]);
						console.log(usersInGame);
					}
				}
			} catch (error) {
				console.log(error);
			}
		};

		getQuestions();
		getUsers();
		setIsLoading(false);

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, [gameId]);

	useEffect(() => {
		questions && setThisQuestion(questions[`${selectedQuestion}`]);
	}, [questions, selectedQuestion]);

	useEffect(() => {
		thisQuestion && console.log(thisQuestion);
		thisQuestion && setTime(thisQuestion.question.timer);
	}, [thisQuestion]);

	useEffect(() => {
		const postUserAnswers = async () => {
			await axiosJWT.post(userAnswersRoute, {
				answer: answer,
				userId: `/api/users/${userId}`,
				question: `/api/questions/${thisQuestion.question.id}`,
				game: `/api/games/${gameId}`,
			});
		};

		if (!noMoreTime && time) {
			if (isLastQuestion) {
				return;
			}
			timerRef.current.setAttribute(
				"style",
				"animation: countdown " + time + "s linear forwards"
			);
			inputRef.current.focus();
			setRemainingTime(time);
			startTimer();
		}
		if (noMoreTime && selectedQuestion <= questions.length) {
			// on poste la réponse de l'utilisateur
			postUserAnswers();
			setAnswer("");
			setNoMoreTime((prev) => !prev);
			setSelectedQuestion((prev) => prev + 1);

			return;
		}
		return () => {
			clearInterval(timerId.current);
		};
	}, [noMoreTime, time]);

	useEffect(() => {
		if (remainingTime === 0) {
			return setNoMoreTime(true);
		}
	}, [remainingTime]);

	const startTimer = () => {
		timerId.current = setInterval(decrementRemainingTime, 1000);
	};

	const setColor = (prev) => {
		if (prev <= 10) {
			timerRef.current.classList.add("warning");
		}
	};

	const decrementRemainingTime = () => {
		return setRemainingTime((prev) => {
			if (prev > 0) {
				setColor(prev - 1);
				return prev - 1;
			} else {
				// setNoMoreTime(true);
				clearInterval(timerId.current);
				timerId.current = 0;
				return 0;
			}
		});
	};

	const progressBarCalc = () => {
		const result = ((selectedQuestion + 1) / questions.length) * 100;

		return result;
	};

	const getParseMedia = () => {
		if (thisQuestion.question.media.length > 0) {
			const media = thisQuestion.question.media[0].contentUrl;
			console.log(media);
			if (media.includes("mp4")) {
				return (
					<video width="750" height="500" controls autoPlay muted>
						<source src={media} type="video/mp4" />
					</video>
				);
			} else if (
				media.includes("png") ||
				media.includes("jpeg") ||
				media.includes("jpg") ||
				media.includes("gif")
			) {
				return <img src={media} alt="image" />;
			} else if (media.includes("mp3")) {
				return (
					<audio src={media} autoPlay controls>
						{/* eslint-disable-next-line react/no-unescaped-entities */}
						Votre navigateur ne supporte pas l'élément <code>audio</code>.
					</audio>
				);
			}
		}
		return;
	};

	// fonction pour vérifier que tous les joueurs ont répondu à toutes les questions : userAnswer length === questions length
	const areAllUsersDone = async () => {
		try {
			const usersArray = await Promise.all(
				users.map(async (user) => {
					const { data: usersAnswers } = await axiosJWT.get(
						`${userAnswersRoute}?userId=${user.userId.id}&game=${gameId}`
					);
					if (usersAnswers) {
						return usersAnswers["hydra:member"].length === questions.length
							? true
							: false;
					}
				})
			);
			return usersArray;
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		let count = 0;
		const url = new URL(mercureHubUrl);
		url.searchParams.append("topic", `${host}${userAnswersRoute}/{id}`);
		const eventSource = new EventSource(url);
		eventSource.onmessage = (e) => {
			// console.log("userAnswer", e);
			// console.log(JSON.parse(e.data));
			count++;
			// if (count === users.length * questions.length && isUserGameMaster()) {
			// 	return navigate(`/correction/${gameId}`);
			// }
			if (count === users.length * questions.length) {
				return navigate(`/correction/${gameId}`);
			}
		};
		return () => {
			eventSource.close();
		};
	}, [questions]);

	const handleButton = async () => {
		console.log(await areAllUsersDone());
		const usersReadyorNot = await areAllUsersDone();
		const notReadyToCorrect = usersReadyorNot.some(
			(finished) => finished === false
		);

		if (notReadyToCorrect) {
			return toast.info(
				"Veuillez attendre que tous les joueurs aient terminé le quizz",
				toastOptions
			);
		} else {
			if (isUserGameMaster()) {
				return navigate(`/correction/${gameId}`);
			} else {
				const isGameCorrected = await fetchIsGameCorrected();
				if (isGameCorrected) {
					btnRef.current.innerText = "Afficher les résultats";
					return navigate(`/palmares/${gameId}`);
				}
				return toast.info(
					"Veuillez attendre que le Maître du Jeu corrige la partie",
					toastOptions
				);
			}
		}
	};

	const fetchIsGameCorrected = async () => {
		try {
			const { data: thisGame } = await axiosJWT.get(`${gamesRoute}/${gameId}`);
			// setIsGameCorrected("")
			if (thisGame) {
				return thisGame.is_corrected === true ? true : false;
			}
		} catch (error) {
			console.log(error);
		}
	};

	const isUserGameMaster = () => {
		return users?.filter(
			(thisUser) =>
				thisUser.is_game_master === true && thisUser.userId.email === user.email
		).length === 1
			? true
			: false;
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
			<Header />
			{isLoading ? (
				<Gameskel />
			) : (
				<main>
					{/* {!isLastQuestion ? (
					<> */}
					{thisQuestion && (
						<div className="game-content">
							<Timer
								remainingTime={remainingTime}
								forwardRef={timerRef}
								time={noMoreTime}
							/>
							<div className="game-box">
								<div className="media">{getParseMedia()}</div>
								<div className="question">
									<p>{thisQuestion.question.question}</p>
								</div>
								<div className="answer">
									<form onSubmit={(e) => e.preventDefault()}>
										<input
											ref={inputRef}
											type="text"
											name=""
											value={answer}
											onChange={(e) => setAnswer(e.target.value)}
										/>
									</form>
								</div>
							</div>

							<ProgressBar
								level={thisQuestion.question.level}
								progress={progressBarCalc()}
							/>
						</div>
					)}
					{/* </>
				) : (
					<>
						{isUserGameMaster() ? (
							<Button label={"Valider les réponses"} onClick={handleButton} />
						) : (
							<Button
								label={"Correction en cours..."}
								onClick={handleButton}
								forwardRef={btnRef}
							/>
						)}
					</>
				)} */}
				</main>
			)}

			<Message gameId={gameId} userId={userId} />
			<Footer />
			<ToastContainer />
		</>
	);
};

export default Game;
