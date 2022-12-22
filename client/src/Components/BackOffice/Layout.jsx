import { Layout } from "react-admin";
import { MyMenu } from "./Menu";
import MyAppBar from "./AppBar";

export const CustomLayout = (props) => (
	<Layout
		{...props}
		menu={MyMenu}
		appBar={MyAppBar}
		sx={{ "& .RaLayout-appFrame": { width: "100vw" } }}
	/>
);
