import classes from "./index.module.css";

const Toolbox = ({ children, type, show }) => {
	const toolboxClass =
		classes.toolbox +
		(type === "eraser" ? " " + classes["toolbox--eraser"] : "") +
		(!show ? " " + classes["toolbox--hidden"] : "");

	return (
		<div className={toolboxClass} onClick={(event) => event.stopPropagation()}>
			<div className={classes.nose} />
			{children}
		</div>
	);
};

export default Toolbox;
