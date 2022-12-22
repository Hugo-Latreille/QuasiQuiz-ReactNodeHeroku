import {
	ListGuesser,
	FieldGuesser,
	ShowGuesser,
	CreateGuesser,
	InputGuesser,
	EditGuesser,
} from "@api-platform/admin";
import { TextField, DateField, EmailField, PasswordInput } from "react-admin";

const UsersList = (props) => (
	<ListGuesser {...props} pagination={false}>
		<TextField source="id" />
		<EmailField source="email" />
		<FieldGuesser source="pseudo" />
		{/* <FieldGuesser source="password" /> */}
		<DateField source="created_at" showTime locales="fr-FR" />
		<DateField source="updated_at" showTime locales="fr-FR" />
	</ListGuesser>
);

const UserShow = (props) => (
	<ShowGuesser {...props} sx={{ width: "85vw" }}>
		<TextField source="id" />
		<EmailField source="email" />
		<FieldGuesser source="pseudo" />
		{/* <FieldGuesser source="password" /> */}
		<DateField source="created_at" showTime locales="fr-FR" />
		<DateField source="updated_at" showTime locales="fr-FR" />
	</ShowGuesser>
);

const UserCreate = (props) => (
	<CreateGuesser {...props} sx={{ width: "85vw" }}>
		<InputGuesser source="email" />
		<InputGuesser source="pseudo" />
		<PasswordInput source="password" />
	</CreateGuesser>
);

const UserEdit = (props) => (
	<EditGuesser {...props} sx={{ width: "85vw" }}>
		<InputGuesser source="email" />
		<InputGuesser source="pseudo" />
		<PasswordInput source="password" />
	</EditGuesser>
);

export { UsersList, UserShow, UserCreate, UserEdit };
