import { Switch, Route, Redirect } from "react-router-dom";
import New from "../../Pages/New";
import Inbox from "../../Pages/Inbox";
import BasePage from "../../Pages/BasePage";
import SentItem from "../../Components/SentItem";
import InboxItem from "../../Components/InboxItem";
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
					<BasePage type="inbox" title="나에게 온 편지" item={InboxItem} />
				</Route>
				<Route exact path="/sent">
					<BasePage type="sent" title="내가 보낸 편지" item={SentItem} />
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
