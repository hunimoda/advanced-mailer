import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Switch, Route, useHistory } from "react-router";
import MainHeader from "./Components/MainHeader";
import SideBar from "./Components/SideBar";
import MyProfile from "./Components/MyProfile";
import AuthRouter from "./Router/AuthRouter";
import MainRouter from "./Router/MainRouter";

const App = () => {
	const [isSideBarActive, setIsSideBarActive] = useState(false);
	const [isProfileVisible, setIsProfileVisible] = useState(false);

	const history = useHistory();
	const user = useSelector((state) => state.auth.user);

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

	return (
		<Switch>
			<Route exact path="/:writtenBy/:letterId">
				This is the LETTER PAGE!!!
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
