import MainHeader from "./Components/MainHeader";
import Router from "./Router";
import SideBar from "./Components/SideBar";

const App = () => {
	return (
		<>
			<MainHeader />
			<SideBar isActive={false} />
			<Router />
		</>
	);
};

export default App;
