import { Switch, Route } from "react-router-dom";
import Landing from "../../Pages/Landing";
import Forbidden from "../../Pages/Forbidden";

const AuthRouter = () => {
	return (
		<Switch>
			<Route exact path="/">
				<Landing />
			</Route>
			<Route exact path="/sign-in">
				Sign-In Page
			</Route>
			<Route exact path="/sign-up">
				Sign-Up Page
			</Route>
			<Route path="*">
				<Forbidden />
			</Route>
		</Switch>
	);
};

export default AuthRouter;
