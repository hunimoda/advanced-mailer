import { Switch, Route } from "react-router-dom";

const AuthRouter = () => {
	return (
		<Switch>
			<Route exact path="/">
				Landing Page
			</Route>
			<Route exact path="/sign-in">
				Sign-In Page
			</Route>
			<Route exact path="/sign-up">
				Sign-Up Page
			</Route>
			<Route exact path="/:writtenBy/:letterId">
				Letter Page
			</Route>
			<Route path="*">Forbidden!!!</Route>
		</Switch>
	);
};

export default AuthRouter;
