import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route, useHistory } from "react-router";
import { setAuthObserver } from "./Firebase/auth";
import { authActions } from "./Context/auth";
import Letter from "./Pages/Letter";
import AuthRouter from "./Router/AuthRouter";
import MainRouter from "./Router/MainRouter";

const App = () => {
	const history = useHistory();
	const [isInitialized, setIsInitialized] = useState(false);

	const user = useSelector((state) => state.auth.user);
	const dispatch = useDispatch();

	useEffect(() => {
		setAuthObserver((user) => {
			if (user) {
				dispatch(authActions.signIn(user.toJSON()));
			}
			setIsInitialized(true);
		});
	}, [dispatch]);

	useEffect(() => {
		if (user) {
			const returnPath = window.localStorage.getItem("returnPath");

			if (returnPath) {
				window.localStorage.removeItem("returnPath");
				history.replace(returnPath);
			}
		}
	}, [user, history]);

	if (!isInitialized) {
		return <p>Initializing...</p>;
	}

	return (
		<Switch>
			<Route exact path="/view">
				<Letter />
			</Route>
			<Route path="*">{user ? <MainRouter /> : <AuthRouter />}</Route>
		</Switch>
	);
};

export default App;
