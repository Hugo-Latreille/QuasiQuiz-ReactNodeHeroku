import "./message.scss";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { host, mercureHubUrl, messagesRoute } from "../../utils/axios";
import useAxiosJWT from "../../utils/useAxiosJWT";
import { BsFillChatLeftDotsFill } from "react-icons/bs";
import { AiOutlineCloseCircle } from "react-icons/ai";

const Message = ({ gameId, userId }) => {
	const axiosJWT = useAxiosJWT();
	const [messages, setMessages] = useState(null);
	const [chatMessage, setChatMessage] = useState("");
	const [chatOpen, setChatOpen] = useState(false);
	const [notifications, setNotifications] = useState(0);
	const notifRef = useRef(null);
	const bottomRef = useRef(null);

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();
		const getMessages = async () => {
			try {
				if (gameId) {
					const { data: messagesInGame } = await axiosJWT.get(
						`${messagesRoute}?game=${gameId}`,
						{
							signal: controller.signal,
						}
					);
					if (isMounted && messagesInGame) {
						const allMessages = messagesInGame["hydra:member"];
						setMessages(allMessages);
					}
				}
			} catch (error) {
				console.log(error);
			}
		};
		getMessages();

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, [gameId]);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
		const url = new URL(mercureHubUrl);
		url.searchParams.append("topic", `${host}${messagesRoute}/{id}`);
		const eventSource = new EventSource(url);
		eventSource.onmessage = (e) => {
			console.log("Message", e);
			console.log(JSON.parse(e.data));
			setNotifications((prev) => prev + 1);

			if (notifRef.current) {
				notifRef.current.classList.add("animate");
				setTimeout(() => {
					notifRef.current.classList.remove("animate");
				}, 2000);
			}

			setMessages((prev) => [...prev, JSON.parse(e.data)]);
		};
		return () => {
			eventSource.close();
		};
	}, [messages]);

	useEffect(() => {
		chatOpen && bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [chatOpen]);

	const handleMessage = async (e) => {
		e.preventDefault();
		try {
			const { data: test } = await axiosJWT.post(messagesRoute, {
				message: chatMessage,
				userId: `/api/users/${userId}`,
				game: `/api/games/${gameId}`,
			});
			setChatMessage("");
		} catch (error) {
			console.log(error);
		}
	};

	const isMessageUserGameMaster = (message) => {
		return message.game.gameHasUsers.filter(
			(user) => user.userId.id === message.userId.id && user.is_game_master
		).length === 1
			? true
			: false;
	};

	return (
		<>
			{!chatOpen ? (
				<div className="chatIcon">
					<div className="notifications" ref={notifRef}>
						{notifications}
					</div>
					<BsFillChatLeftDotsFill
						onClick={() => {
							setChatOpen(true);
							setNotifications(0);
						}}
					/>
				</div>
			) : (
				<div className="messageContainer">
					{messages &&
						messages.map((message) => (
							<div key={message.id}>
								<p
									className={
										isMessageUserGameMaster(message)
											? "gameMaster"
											: message.userId.id === userId
											? "me"
											: "other"
									}
								>
									{message.userId.pseudo} : {message.message}
								</p>

								{/* <img
									src={`data:image/svg+xml;base64,${message.userId.avatar}`}
									alt=""
								/> */}
							</div>
						))}
					<div ref={bottomRef} />
					<form onSubmit={handleMessage}>
						<input
							type="text"
							value={chatMessage}
							onChange={(e) => setChatMessage(e.target.value)}
						/>
						<button className="send" type="submit">
							Envoyer
						</button>
						<div className="close">
							<AiOutlineCloseCircle
								onClick={() => {
									setChatOpen(false);
									setNotifications(0);
								}}
							/>
						</div>
					</form>
				</div>
			)}
		</>
	);
};

export default Message;
