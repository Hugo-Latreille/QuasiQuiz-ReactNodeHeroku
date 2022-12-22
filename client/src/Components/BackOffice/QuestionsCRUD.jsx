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
	ReferenceArrayInput,
	AutocompleteArrayInput,
} from "react-admin";

const QuestionsList = (props) => (
	<ListGuesser {...props} pagination={false}>
		<TextField source="id" />
		<FieldGuesser source="question" />
		<NumberField source="timer" />
		<NumberField source="level" />
		<ReferenceField label="Media" source="media" reference="media" link="show">
			<ChipField source="contentUrl" />
		</ReferenceField>
		<ReferenceField
			label="Answer"
			source="answer"
			reference="answers"
			link="show"
		>
			<ChipField source="answer" />
		</ReferenceField>
	</ListGuesser>
);

const QuestionShow = (props) => (
	<ShowGuesser {...props} sx={{ width: "85vw" }}>
		<TextField source="id" />
		<FieldGuesser source="question" />
		<NumberField source="timer" />
		<NumberField source="level" />
		<ReferenceField label="Media" source="media" reference="media" link="show">
			<ChipField source="contentUrl" />
		</ReferenceField>
		<ReferenceField label="Answer" source="answer" reference="answers">
			<TextField source="answer" />
		</ReferenceField>
	</ShowGuesser>
);

const QuestionCreate = (props) => (
	<CreateGuesser {...props} sx={{ width: "85vw" }}>
		<InputGuesser source="question" />
		<InputGuesser source="timer" />
		<InputGuesser source="level" />
		<ReferenceArrayInput source="media" reference="media">
			<AutocompleteArrayInput
				filterToQuery={(searchText) => ({ contentUrl: searchText })}
				optionText="contentUrl"
				label="Media"
				sx={{ width: "35vw" }}
			/>
		</ReferenceArrayInput>
		<ReferenceInput source="answer" reference="answers">
			<AutocompleteInput
				filterToQuery={(searchText) => ({ answer: searchText })}
				optionText="answer"
				label="Answers"
				sx={{ width: "35vw" }}
			/>
		</ReferenceInput>
	</CreateGuesser>
);

const QuestionEdit = (props) => (
	<EditGuesser {...props} sx={{ width: "85vw" }}>
		<InputGuesser source="question" />
		<InputGuesser source="timer" />
		<InputGuesser source="level" />
		<ReferenceArrayInput source="media" reference="media">
			<AutocompleteArrayInput
				filterToQuery={(searchText) => ({ contentUrl: searchText })}
				optionText="contentUrl"
				label="Media"
				sx={{ width: "35vw" }}
			/>
		</ReferenceArrayInput>
		<ReferenceInput source="answer" reference="answers">
			<AutocompleteInput
				filterToQuery={(searchText) => ({ answer: searchText })}
				optionText="answer"
				label="Answers"
				sx={{ width: "35vw" }}
			/>
		</ReferenceInput>
	</EditGuesser>
);

export { QuestionsList, QuestionCreate, QuestionShow, QuestionEdit };
