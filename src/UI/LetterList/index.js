import classes from "./index.module.css";

const LetterList = ({ children }) => {
	return <ul className={classes.letterList}>{children}</ul>;
};

export default LetterList;
