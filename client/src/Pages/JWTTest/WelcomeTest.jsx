import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";

const Welcome = () => {
	const { user } = useContext(UserContext);

	const welcome = user ? `Welcome ${user.email}!` : "Welcome!";
	const tokenAbbr = `${user.token.slice(0, 9)}...`;

	const content = (
		<section className="welcome">
			<h1>{welcome}</h1>
			<p>Token: {tokenAbbr}</p>
			<p>
				<Link to="/authTest">Go to the test</Link>
			</p>
		</section>
	);

	return content;
};
export default Welcome;
