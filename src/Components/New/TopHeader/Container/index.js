import classes from "./index.module.css";

const Container = ({ children, type, label, onClick, selected }) => {
	const containerClass =
		classes.container +
		(type === "long" ? " " + classes["container--long"] : "");
	const borderClass = classes.border + (!selected ? "" + classes.hidden : "");

	return (
		<div className={containerClass} onClick={onClick} data-label={label}>
			<div className={borderClass} />
			{children}
		</div>
	);
};

export default Container;
