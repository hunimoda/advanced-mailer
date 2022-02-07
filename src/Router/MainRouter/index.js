import { Switch, Route, Redirect } from "react-router-dom";
import New from "../../Pages/New";
import BasePage from "../../Pages/BasePage";
import SentItem from "../../Components/SentItem";
import InboxItem from "../../Components/InboxItem";
import Drafts from "../../Pages/Drafts";
import PageNotFound from "../../Pages/PageNotFound";
import Layout from "../../UI/Layout";
import Letter from "../../Pages/Letter";

const MainRouter = () => {
	const innerSwitch = (
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
	);

	return (
		<Switch>
			<Route exact path="/sent/:id">
				<Letter type="sent" />
			</Route>
			<Route exact path="/inbox/:id">
				<Letter type="inbox" />
			</Route>
			<Route exact path="*">
				<Layout>{innerSwitch}</Layout>
			</Route>
		</Switch>
	);
};

export default MainRouter;
