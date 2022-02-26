import LoadingSpinner from "../../UI/LoadingSpinner";
import classes from "./index.module.css";

const MoreLetters = ({ status, className }) => {
	const divClass = classes.moreLetters + " " + className;

	let display = null;

	if (status === "pending") {
		display = <LoadingSpinner className={classes.spinner} />;
	} else if (status === "none") {
		display = <p className={classes.noLetters}>편지가 더 이상 없습니다.</p>;
	} else {
		return null;
	}

	return <div className={divClass}>{display}</div>;
};

export default MoreLetters;
