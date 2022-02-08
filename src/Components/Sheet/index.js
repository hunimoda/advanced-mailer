import classes from "./index.module.css";

const Sheet = ({ size, backgroundColor, children }) => {
	return (
		<div
			className={classes.sheet}
			style={{
				width: `${size.width}px`,
				height: `${size.height}px`,
				backgroundColor,
			}}
		>
			{children}
		</div>
	);
};

export default Sheet;
