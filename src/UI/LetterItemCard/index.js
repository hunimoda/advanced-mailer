import classes from "./index.module.css";

const LetterItemCard = ({ className, onClick, children }) => {
	const listItemClassName = `${classes.listItem} ${className}`;

	return (
		<li className={listItemClassName} onClick={onClick}>
			{children}
		</li>
	);
};

export default LetterItemCard;
