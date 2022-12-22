import "./_game.scss";
import Header from "../../Layouts/Header";
import Footer from "../../Layouts/Footer";
import { axiosJWT, gameQuestions } from "../../utils/axios";
import { useEffect, useState } from "react";
import Timer from "../../Components/Timer/Timer";
import ProgressBar from "../../Components/ProgressBar/ProgressBar";
import { useParams } from "react-router-dom";

//? set FOCUS sur le champ de réponse (inputRef.current.focus())
const Game = () => {
	// on récupère gameId des paramètres de la route
	const { gameId } = useParams();
	const [questions, setQuestions] = useState([]);
	const [selectedQuestion, setSelectedQuestion] = useState(0);
	const [noMoreTime, setNoMoreTime] = useState(false);
	const [thisQuestion, setThisQuestion] = useState(null);

	// const isLastQuestion = selectedQuestion === questions.length - 1;

	//!calculer % complétion pour progressBar

	// récuperer les questions de cette partie + le temps de chacune + le niveau
	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();
		const getQuestions = async () => {
			try {
				const { data: gameQuestion } = await axiosJWT.get(
					`${gameQuestions}?game=${gameId}`,
					{
						signal: controller.signal,
					}
				);
				if (isMounted && gameQuestion) {
					console.log(gameQuestion);
					setQuestions(gameQuestion["hydra:member"]);
				}
			} catch (error) {
				console.log(error);
			}
		};
		getQuestions();

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, [gameId]);

	useEffect(() => {
		questions && setThisQuestion(questions[`${selectedQuestion}`]);
	}, [questions, selectedQuestion]);

	useEffect(() => {
		if (noMoreTime && selectedQuestion <= questions.length) {
			setNoMoreTime((prev) => !prev);
			return setSelectedQuestion((prev) => prev + 1);
		}
	}, [noMoreTime]);

	const getParseMedia = () => {
		if (thisQuestion.question.media.length > 0) {
			const media = thisQuestion.question.media[0].contentUrl;
			if (media.includes("mp4")) {
				return (
					<video width="750" height="500" controls autoPlay muted>
						<source src={media} type="video/mp4" />
					</video>
				);
			} else if (media.includes("png")) {
				return <img src={media} alt="image" />;
			}
		}
		return;
	};
	return (
		<>
			<Header />
			<main>
				<p style={{ color: "white" }}>{selectedQuestion}</p>
				{thisQuestion && (
					<div className="game-content">
						<Timer
							time={thisQuestion.question.timer}
							setNoMoreTime={setNoMoreTime}
							noMoreTime={noMoreTime}
						/>
						<div className="game-box">
							<div className="media">{getParseMedia()}</div>
							<div className="question">
								<p>{thisQuestion.question.question}</p>
							</div>
							<div className="answer">
								<form action="">
									<input type="text" name="" id="" />
								</form>
							</div>
						</div>

						<ProgressBar level={thisQuestion.question.level} progress={50} />
					</div>
				)}
			</main>
			<Footer />
		</>
	);
};

export default Game;
