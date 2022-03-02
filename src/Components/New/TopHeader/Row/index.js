import classes from "./index.module.css";

const Row = ({ children }) => {
	return <div className={classes.row}>{children}</div>;
};

export default Row;
