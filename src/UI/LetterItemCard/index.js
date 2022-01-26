import classes from "./index.module.css";

const LetterItemCard = ({ className, children }) => {
	const listItemClassName = `${classes.listItem} ${className}`;

	return <li className={listItemClassName}>{children}</li>;
};

export default LetterItemCard;
