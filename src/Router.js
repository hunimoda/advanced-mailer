import { Switch, Route, Redirect } from "react-router-dom";
import New from "./Pages/New";
import Inbox from "./Pages/Inbox";
import Sent from "./Pages/Sent";
import Drafts from "./Pages/Drafts";
import PageNotFound from "./Pages/PageNotFound";

const Router = () => {
	return (
		<Switch>
			<Route exact path="/">
				<Redirect to="/inbox" />
			</Route>
			<Route exact path="/new">
				<New />
			</Route>
			<Route exact path="/inbox">
				<Inbox />
			</Route>
			<Route exact path="/sent">
				<Sent />
			</Route>
			<Route exact path="/drafts">
				<Drafts />
			</Route>
			<Route path="*">
				<PageNotFound />
			</Route>
		</Switch>
	);
};

export default Router;
