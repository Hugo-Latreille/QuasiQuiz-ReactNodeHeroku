import {
	HydraAdmin,
	fetchHydra,
	hydraDataProvider,
	ResourceGuesser,
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

function Admin() {
	const entrypoint = import.meta.env.VITE_API_ENTRYPOINT;

	const dataProvider = hydraDataProvider({
		entrypoint,
		httpClient: fetchHydra,
		apiDocumentationParser: parseHydraDocumentation,
		mercure: true,
		useEmbedded: false,
	});

	return (
		<HydraAdmin
			basename="/admin"
			entrypoint={entrypoint}
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
