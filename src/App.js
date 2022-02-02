import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route, useHistory } from "react-router";
import { setAuthObserver } from "./Firebase/auth";
import { authActions } from "./Context/auth";
import Letter from "./Pages/Letter";
import MainHeader from "./Components/MainHeader";
import SideBar from "./Components/SideBar";
import MyProfile from "./Components/MyProfile";
import AuthRouter from "./Router/AuthRouter";
import MainRouter from "./Router/MainRouter";

const App = () => {
	const [isInitialized, setIsInitialized] = useState(false);
	const [isSideBarActive, setIsSideBarActive] = useState(false);
	const [isProfileVisible, setIsProfileVisible] = useState(false);

	const history = useHistory();
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

	const onSideBarOpen = () => setIsSideBarActive(true);

	const onSideBarClose = () => setIsSideBarActive(false);

	const onProfileOpen = () => setIsProfileVisible(true);

	const onProfileClose = () => setIsProfileVisible(false);

	if (!isInitialized) {
		return <p>Initializing...</p>;
	}

	return (
		<Switch>
			<Route exact path="/:letter([-0-9A-Za-z_]{128})">
				<Letter />
			</Route>
			<Route path="*">
				{user ? (
					<>
						<MainHeader
							onSideBarOpen={onSideBarOpen}
							onProfileOpen={onProfileOpen}
						/>
						<SideBar
							isActive={isSideBarActive}
							onSideBarClose={onSideBarClose}
							onProfileOpen={onProfileOpen}
						/>
						{isProfileVisible && <MyProfile onProfileClose={onProfileClose} />}
						<MainRouter />
					</>
				) : (
					<AuthRouter />
				)}
			</Route>
		</Switch>
	);
};

export default App;
