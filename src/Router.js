import { Switch, Route, Redirect } from "react-router-dom";

const Router = () => {
	return (
		<Switch>
			<Route exact path="/">
				<Redirect to="/inbox" />
			</Route>
			<Route exact path="/new">
				<h2>New Page</h2>
			</Route>
			<Route exact path="/inbox">
				<h2>Inbox Page</h2>
			</Route>
			<Route exact path="/sent">
				<h2>Sent Page</h2>
			</Route>
			<Route exact path="/drafts">
				<h2>Drafts Page</h2>
			</Route>
			<Route path="*">
				<h2>404 Page not found</h2>
			</Route>
		</Switch>
	);
};

export default Router;
