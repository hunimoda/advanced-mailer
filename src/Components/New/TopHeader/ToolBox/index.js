import classes from "./index.module.css";

const Toolbox = ({ children, type }) => {
	const toolboxClass =
		classes.toolbox +
		(type === "eraser" ? " " + classes["toolbox--eraser"] : "");

	return (
		<div className={toolboxClass} onClick={(event) => event.stopPropagation()}>
			<div className={classes.nose} />
			{children}
		</div>
	);
};

export default Toolbox;
