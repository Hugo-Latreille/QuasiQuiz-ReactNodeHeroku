import {
	HydraAdmin,
	fetchHydra as baseFetchHydra,
	hydraDataProvider as baseHydraDataProvider,
	ResourceGuesser,
	useIntrospection,
} from "@api-platform/admin";
import { parseHydraDocumentation } from "@api-platform/api-doc-parser";
import {
	QuestionsList,
	QuestionCreate,
	QuestionShow,
	QuestionEdit,
} from "../../Components/BackOffice/QuestionsCRUD";
import {
	AnswerList,
	AnswerShow,
	AnswerCreate,
	AnswerEdit,
} from "../../Components/BackOffice/AnswersCRUD";
import {
	UsersList,
	UserShow,
	UserCreate,
	UserEdit,
} from "../../Components/BackOffice/UsersCRUD";
import {
	MediaList,
	MediaShow,
	MediaCreate,
} from "../../Components/BackOffice/MediaCRUD";
import { CustomLayout } from "../../Components/BackOffice/Layout";
import authProvider from "../../Components/BackOffice/authProvider";
import inMemoryJwt from "../../Components/BackOffice/inMemoryJwt";
import { Navigate, Route } from "react-router-dom";

function Admin() {
	const entrypoint = import.meta.env.VITE_API_ENTRYPOINT;

	const getHeaders = () =>
		inMemoryJwt.getToken()
			? {
					Authorization: `Bearer ${inMemoryJwt.getToken()}`,
			  }
			: {};
	const fetchHydra = (url, options = {}) =>
		baseFetchHydra(url, {
			...options,
			headers: getHeaders,
		});
	const RedirectToLogin = () => {
		const introspect = useIntrospection();

		if (inMemoryJwt.getToken()) {
			introspect();
			return <></>;
		}
		return <Navigate to="/login" />;
	};

	// const apiDocumentationParser = (setRedirectToLogin) => async () => {
	// 	try {
	// 		setRedirectToLogin(false);

	// 		return await parseHydraDocumentation(entrypoint, { headers: getHeaders });
	// 	} catch (result) {
	// 		const { api, response, status } = result;
	// 		if (status !== 401 || !response) {
	// 			throw result;
	// 		}

	// 		// Prevent infinite loop if the token is expired
	// 		inMemoryJwt.eraseToken();

	// 		setRedirectToLogin(true);

	// 		return {
	// 			api,
	// 			response,
	// 			status,
	// 		};
	// 	}
	// };

	const apiDocumentationParser = async (entrypoint) => {
		try {
			const { api } = await parseHydraDocumentation(entrypoint, {
				headers: getHeaders,
			});
			return { api };
		} catch (result) {
			if (result.status === 401) {
				// Prevent infinite loop if the token is expired
				inMemoryJwt.eraseToken();

				return {
					api: result.api,
					customRoutes: [
						<Route key="1" path="/" component={RedirectToLogin} />,
					],
				};
			}

			throw result;
		}
	};

	const dataProvider = baseHydraDataProvider({
		entrypoint,
		httpClient: fetchHydra,
		apiDocumentationParser,
		useEmbedded: false,
	});

	return (
		<HydraAdmin
			basename="/admin"
			entrypoint={entrypoint}
			authProvider={authProvider}
			dataProvider={dataProvider}
			layout={CustomLayout}
		>
			<ResourceGuesser
				name="users"
				list={UsersList}
				show={UserShow}
				edit={UserEdit}
				create={UserCreate}
				options={{ label: "Utilisateurs" }}
			/>
			<ResourceGuesser
				name="questions"
				list={QuestionsList}
				show={QuestionShow}
				create={QuestionCreate}
				edit={QuestionEdit}
				options={{ label: "Questions" }}
			/>
			<ResourceGuesser
				name="answers"
				list={AnswerList}
				show={AnswerShow}
				create={AnswerCreate}
				edit={AnswerEdit}
				options={{ label: "Réponses" }}
			/>
			<ResourceGuesser
				name="media"
				list={MediaList}
				show={MediaShow}
				create={MediaCreate}
				options={{ label: "Média" }}
			/>
		</HydraAdmin>
	);
}

export default Admin;
