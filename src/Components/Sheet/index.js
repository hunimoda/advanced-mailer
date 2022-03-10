import classes from "./index.module.css";

const Sheet = ({
	children,
	sheet,
	className,
	onPointerDown,
	onPointerMove,
	onPointerUp,
}) => {
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
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerUp={onPointerUp}
			onTouchEnd={(event) => event.preventDefault()}
		>
			{children}
		</div>
	);
};

export default Sheet;
