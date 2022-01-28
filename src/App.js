import { useState } from "react";
import { useSelector } from "react-redux";
import MainHeader from "./Components/MainHeader";
import SideBar from "./Components/SideBar";
import MyProfile from "./Components/MyProfile";
import AuthRouter from "./Router/AuthRouter";
import MainRouter from "./Router/MainRouter";

const App = () => {
	const user = useSelector((state) => state.auth.user);

	const [isSideBarActive, setIsSideBarActive] = useState(false);
	const [isProfileVisible, setIsProfileVisible] = useState(false);

	const onSideBarOpen = () => setIsSideBarActive(true);

	const onSideBarClose = () => setIsSideBarActive(false);

	const onProfileOpen = () => setIsProfileVisible(true);

	const onProfileClose = () => setIsProfileVisible(false);

	if (!user) {
		return <AuthRouter />;
	}

	return (
		<>
			<MainHeader onSideBarOpen={onSideBarOpen} onProfileOpen={onProfileOpen} />
			<SideBar
				isActive={isSideBarActive}
				onSideBarClose={onSideBarClose}
				onProfileOpen={onProfileOpen}
			/>
			{isProfileVisible && <MyProfile onProfileClose={onProfileClose} />}
			<MainRouter />
		</>
	);
};

export default App;
