import classes from "./index.module.css";

const LetterSheet = ({ style, children }) => {
	return (
		<div className={classes.letterSheet} style={style}>
			{children}
		</div>
	);
};

export default LetterSheet;
