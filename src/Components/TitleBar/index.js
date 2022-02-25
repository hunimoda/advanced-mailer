import MoreLetters from "../MoreLetters";
import classes from "./index.module.css";

const TitleBar = ({ children, onRefresh, status }) => {
	return (
		<div className={classes.titleBar}>
			<h2 className={classes.title}>{children}</h2>
			<button onClick={onRefresh} className={classes.refreshButton}>
				{status === "pending" ? (
					<MoreLetters status={status} />
				) : (
					<i className="fas fa-sync-alt" />
				)}
			</button>
		</div>
	);
};

export default TitleBar;
