import classes from "./index.module.css";

const Container = ({ children, type, label, onClick, selected, opaque }) => {
	const containerClass =
		classes.container +
		(type === "long" ? " " + classes["container--long"] : "") +
		(opaque ? " " + classes["container--opaque"] : "");
	const borderClass = classes.border + (!selected ? "" + classes.hidden : "");

	return (
		<div className={containerClass} onClick={onClick} data-label={label}>
			<div className={borderClass} />
			{children}
		</div>
	);
};

export default Container;
