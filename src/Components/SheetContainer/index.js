import { useState } from "react";
import classes from "./index.module.css";

const SheetContainer = ({ sheetSize, backgroundColor, children }) => {
	return (
		<div
			className={classes.sheet}
			style={
				sheetSize && {
					width: `${sheetSize.width}px`,
					height: `${sheetSize.height}px`,
					backgroundColor,
				}
			}
		>
			{children}
		</div>
	);
};

export default SheetContainer;
