import { useState } from "react";
import MainHeader from "./Components/MainHeader";
import Router from "./Router";
import SideBar from "./Components/SideBar";

const App = () => {
	const [isSideBarActive, setIsSideBarActive] = useState(false);

	const onSideBarOpen = () => setIsSideBarActive(true);

	const onSideBarClose = () => setIsSideBarActive(false);

	return (
		<>
			<MainHeader onSideBarOpen={onSideBarOpen} />
			<SideBar isActive={isSideBarActive} onSideBarClose={onSideBarClose} />
			<Router />
		</>
	);
};

export default App;
