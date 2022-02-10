import { forwardRef } from "react";
import classes from "./index.module.css";

const Sheet = forwardRef(({ size, backgroundColor, children }, ref) => {
	return (
		<div
			ref={ref}
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
});

export default Sheet;
