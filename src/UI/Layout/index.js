import { useState } from "react";
import MainHeader from "../../Components/MainHeader";
import SideBar from "../../Components/SideBar";
import MyProfile from "../../Components/MyProfile";
import classes from "./index.module.css";

const Layout = ({ children }) => {
	const [isSideBarActive, setIsSideBarActive] = useState(false);
	const [isProfileVisible, setIsProfileVisible] = useState(false);

	const onSideBarOpen = () => setIsSideBarActive(true);

	const onSideBarClose = () => setIsSideBarActive(false);

	const onProfileOpen = () => setIsProfileVisible(true);

	const onProfileClose = () => setIsProfileVisible(false);

	return (
		<>
			<MainHeader onSideBarOpen={onSideBarOpen} onProfileOpen={onProfileOpen} />
			<SideBar
				isActive={isSideBarActive}
				onSideBarClose={onSideBarClose}
				onProfileOpen={onProfileOpen}
			/>
			{isProfileVisible && <MyProfile onProfileClose={onProfileClose} />}
			<main className={classes.main}>{children}</main>
		</>
	);
};

export default Layout;
