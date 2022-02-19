import { forwardRef } from "react";
import { useSelector } from "react-redux";
import classes from "./index.module.css";

const Sheet = forwardRef(({ size, children }, ref) => {
	const backgroundColor = useSelector(
		(state) => state.letter.sheet.backgroundColor
	);
	const backgroundImage = useSelector(
		(state) => state.letter.sheet.backgroundImage
	);

	return (
		<div
			ref={ref}
			className={classes.sheet}
			style={{
				width: `${size.width}px`,
				height: `${size.height}px`,
				backgroundColor,
				backgroundImage: `url("${backgroundImage}")`,
			}}
		>
			{children}
		</div>
	);
});

export default Sheet;
