import classes from "./index.module.css";

const ListItemCard = ({ className, children }) => {
	const listItemClassName = `${classes.listItem} ${className}`;

	return <li className={listItemClassName}>{children}</li>;
};

export default ListItemCard;
