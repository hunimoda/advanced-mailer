// import { Switch, Route } from "react-router-dom";
import Landing from "../../Pages/Landing";

const AuthRouter = () => {
	return <Landing />;
	// return (
	// 	<Switch>
	// 		<Route exact path="/">
	// 			Landing Page
	// 		</Route>
	// 		<Route exact path="/sign-in">
	// 			Sign-In Page
	// 		</Route>
	// 		<Route exact path="/sign-up">
	// 			Sign-Up Page
	// 		</Route>
	// 		<Route path="*">Forbidden!!!</Route>
	// 	</Switch>
	// );
};

export default AuthRouter;
