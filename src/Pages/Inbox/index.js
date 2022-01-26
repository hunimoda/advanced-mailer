import InboxItem from "../../Components/InboxItem";
import classes from "./index.module.css";

const Inbox = () => {
	return (
		<>
			<h2>받은 편지함</h2>
			<ul className={classes.inboxList}>
				<InboxItem className={classes.inboxItem} />
				<InboxItem className={classes.inboxItem} />
				<InboxItem className={classes.inboxItem} />
			</ul>
		</>
	);
};

export default Inbox;
