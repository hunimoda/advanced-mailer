import classes from "./index.module.css";

const TitleBar = ({ children }) => {
	return (
		<div className={classes.titleBar}>
			<h2 className={classes.title}>{children}</h2>
		</div>
	);
};

export default TitleBar;
