import { Switch, Route, Redirect } from "react-router-dom";
import New from "../../Pages/New";
import Inbox from "../../Pages/Inbox";
import Sent from "../../Pages/Sent";
import Drafts from "../../Pages/Drafts";
import PageNotFound from "../../Pages/PageNotFound";
import classes from "./index.module.css";

const MainRouter = () => {
	return (
		<main className={classes.main}>
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
		</main>
	);
};

export default MainRouter;
