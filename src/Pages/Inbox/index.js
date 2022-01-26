import TitleBar from "../../Components/TitleBar";
import InboxItem from "../../Components/InboxItem";
import classes from "./index.module.css";

const Inbox = () => {
	return (
		<>
			<TitleBar />
			<ul className={classes.inboxList}>
				<InboxItem className={classes.inboxItem} />
				<InboxItem className={classes.inboxItem} />
				<InboxItem className={classes.inboxItem} />
			</ul>
		</>
	);
};

export default Inbox;
