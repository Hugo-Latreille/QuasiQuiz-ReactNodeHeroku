import {
	ListGuesser,	
	ShowGuesser,
	CreateGuesser,
	
	
} from "@api-platform/admin";
import {
	TextField,
	ReferenceField,
	ChipField,
	ReferenceInput,
	AutocompleteInput,
	DateField,
	FileInput,
	FileField,
} from "react-admin";

const MediaList = (props) => (
	<ListGuesser {...props} pagination={false}>
		<TextField source="id" />
		<FileField source="contentUrl" title="contentUrl" target="_blank" />
		<ReferenceField
			label="Question"
			source="question"
			reference="questions"
			link="show"
		>
			<ChipField source="question" />
		</ReferenceField>
		<DateField source="created_at" showTime locales="fr-FR" />
		<DateField source="updated_at" showTime locales="fr-FR" />
	</ListGuesser>
);

const MediaShow = (props) => (
	<ShowGuesser {...props} sx={{ width: "85vw" }}>
		<TextField source="id" />
		<FileField source="contentUrl" title="contentUrl" target="_blank" />
		<ReferenceField
			label="Question"
			source="question"
			reference="questions"
			link="show"
		>
			<ChipField source="question" />
		</ReferenceField>
		<DateField source="created_at" showTime locales="fr-FR" />
		<DateField source="updated_at" showTime locales="fr-FR" />
	</ShowGuesser>
);

const MediaCreate = (props) => (
	<CreateGuesser {...props} sx={{ width: "85vw" }}>
		<FileInput source="file">
			<FileField source="src" title="title" />
		</FileInput>
		<ReferenceInput source="question" reference="questions">
			<AutocompleteInput
				filterToQuery={(searchText) => ({ question: searchText })}
				optionText="question"
				label="Question"
				sx={{ width: "35vw" }}
			/>
		</ReferenceInput>
	</CreateGuesser>
);

export { MediaList, MediaShow, MediaCreate };
