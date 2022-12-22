import "./App.scss";
import Home from "./Pages/Home/Home";
import { Route, Routes, useLocation } from "react-router-dom";
import Connexion from "./Pages/Connexion/Connexion";
import Lobby from "./Pages/Lobby/Lobby";
import Error from "./Pages/404/Error";
import Game from "./Pages/Game/Game";
import Correction from "./Pages/Correction/Correction";
import Palmares from "./Pages/Palmares/Palmares";
import Profile from "./Pages/Profile/Profile";
import { createContext, useReducer } from "react";
import RequireAuth from "./utils/RequireAuth";
import AuthTest from "./Pages/JWTTest/AuthTest";
import WelcomeTest from "./Pages/JWTTest/WelcomeTest";
import PersistLogin from "./utils/PersistLogin";
import PasswordEdit from "./Pages/PasswordEdit/PasswordEdit";

export const UserContext = createContext();

const initialState = {
	user: {
		token: null,
		email: null,
		role: null,
	},
};
const actions = {
	ADD_USER: "ADD_USER",
	REMOVE_USER: "REMOVE_USER",
	REFRESH_TOKEN: "REFRESH_TOKEN",
};

const userReducer = (state, action) => {
	switch (action.type) {
		case actions.ADD_USER:
			return {
				...state,
				user: {
					...state.user,
					token: action.payload.token,
					email: action.payload.email,
					role: action.payload.role,
				},
			};
		case actions.REMOVE_USER:
			return {
				...state,
				user: {
					...state.user,
					token: "",
					email: "",
					role: [],
				},
			};
		case actions.REFRESH_TOKEN:
			return {
				...state,
				user: {
					...state.user,
					token: action.payload,
				},
			};
		default:
			return state;
	}
};
const Provider = ({ children }) => {
	const [state, dispatch] = useReducer(userReducer, initialState);
	const value = {
		user: state.user,
		addUser: (payload) => {
			dispatch({ type: actions.ADD_USER, payload });
		},
		removeUser: () => {
			dispatch({ type: actions.REMOVE_USER });
		},
		refreshToken: (payload) => {
			dispatch({ type: actions.REFRESH_TOKEN, payload });
		},
	};
	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

function App() {
	const location = useLocation();
	const background = location.state && location.state.background;

	return (
		<Provider>
			<Routes location={background || location}>
				<Route path="/" element={<Home />}>
					<Route path="login" element={<Connexion />} />
				</Route>

				{/* Routes privées */}
				<Route element={<PersistLogin />}>
					<Route element={<RequireAuth />}>
						<Route path="/test" element={<WelcomeTest />} />
						<Route path="/authTest" element={<AuthTest />} />
						<Route path="lobby" element={<Lobby />} />
						<Route path="game/:gameId" element={<Game />} />
						<Route path="correction/:gameId" element={<Correction />} />
						<Route path="palmares/:gameId" element={<Palmares />} />
						<Route path="profil" element={<Profile />} />
						<Route path="password/:userId" element={<PasswordEdit />} />
					</Route>
				</Route>
				<Route path="*" element={<Error />} />
			</Routes>
			{background && (
				<Routes>
					<Route path="login" element={<Connexion />} />
					<Route path="password/:userId" element={<PasswordEdit />} />
				</Routes>
			)}
		</Provider>
	);
}

export default App;
