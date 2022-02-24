import classes from "./index.module.css";

const Sheet = ({ children, sheet, className }) => {
	if (!sheet.size) {
		return null;
	}

	return (
		<div
			className={`${classes.sheet} ${className}`}
			style={{
				width: `${sheet.size.width}px`,
				height: `${sheet.size.height}px`,
				backgroundColor: sheet.backgroundColor,
				backgroundImage: `url("${sheet.backgroundImage}")`,
			}}
		>
			{children}
		</div>
	);
};

export default Sheet;
