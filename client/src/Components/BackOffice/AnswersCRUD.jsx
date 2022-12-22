import {
	ListGuesser,
	FieldGuesser,
	ShowGuesser,
	CreateGuesser,
	InputGuesser,
	EditGuesser,
} from "@api-platform/admin";
import {
	TextField,
	ReferenceField,
	NumberField,
	ChipField,
	ReferenceInput,
	AutocompleteInput,
	DateField,
	ReferenceArrayInput,
	AutocompleteArrayInput,
} from "react-admin";

const AnswerList = (props) => (
	<ListGuesser {...props} pagination={false}>
		<TextField source="id" />
		<FieldGuesser source="answer" />
		<ReferenceField
			label="Question"
			source="questions"
			reference="questions"
			link="show"
		>
			<ChipField source="question" />
		</ReferenceField>
		<DateField source="created_at" showTime locales="fr-FR" />
		<DateField source="updated_at" showTime locales="fr-FR" />
	</ListGuesser>
);

const AnswerShow = (props) => (
	<ShowGuesser {...props} sx={{ width: "85vw" }}>
		<TextField source="id" />
		<FieldGuesser source="answer" />
		<ReferenceField
			label="Question"
			source="questions"
			reference="questions"
			link="show"
		>
			<ChipField source="question" />
		</ReferenceField>
		<DateField source="created_at" showTime locales="fr-FR" />
		<DateField source="updated_at" showTime locales="fr-FR" />
	</ShowGuesser>
);

const AnswerCreate = (props) => (
	<CreateGuesser {...props} sx={{ width: "85vw" }}>
		<InputGuesser source="answer" />
		<ReferenceArrayInput source="questions" reference="questions">
			<AutocompleteArrayInput
				filterToQuery={(searchText) => ({ question: searchText })}
				optionText="question"
				label="Question"
			/>
		</ReferenceArrayInput>
	</CreateGuesser>
);

const AnswerEdit = (props) => (
	<EditGuesser {...props} sx={{ width: "85vw" }}>
		<InputGuesser source="answer" />
		<ReferenceArrayInput source="questions" reference="questions">
			<AutocompleteArrayInput
				filterToQuery={(searchText) => ({ question: searchText })}
				optionText="question"
				label="Question"
			/>
		</ReferenceArrayInput>
	</EditGuesser>
);

export { AnswerList, AnswerShow, AnswerCreate, AnswerEdit };
