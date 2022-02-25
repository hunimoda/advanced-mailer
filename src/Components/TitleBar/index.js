import { useEffect, useState } from "react";
import classes from "./index.module.css";

const TitleBar = ({ children, onRefresh, status }) => {
	const [titleBarClass, setTitleBarClass] = useState(classes.titleBar);

	useEffect(() => {
		if (status === "pending" && titleBarClass === classes.titleBar) {
			setTitleBarClass(classes.titleBar + " " + classes["titleBar--pending"]);
		} else if (status !== "pending" && titleBarClass !== classes.titleBar) {
			setTimeout(() => setTitleBarClass(classes.titleBar), 1000);
		}
	}, [status, titleBarClass]);

	return (
		<div className={titleBarClass}>
			<h2 className={classes.title}>{children}</h2>
			<button onClick={onRefresh} className={classes.refreshButton}>
				<i className="fas fa-sync-alt" />
			</button>
		</div>
	);
};

export default TitleBar;
