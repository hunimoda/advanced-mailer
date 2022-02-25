import classes from "./index.module.css";

const LetterItemCard = ({ className, children, onClick }) => {
	const listItemClassName = `${classes.listItem} ${className}`;

	return (
		<li onClick={onClick} className={listItemClassName}>
			{children}
		</li>
	);
};

export default LetterItemCard;
