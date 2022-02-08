import { useState, useEffect, useRef } from "react";
import classes from "./index.module.css";

const SheetContainer = ({ sheetRatio, children }) => {
	const [sheetSize, setSheetSize] = useState(null);

	useEffect(() => {
		const { offsetWidth: width, offsetHeight: height } = containerRef.current;
		const containerRatio = width / height;

		const sheetWidth =
			sheetRatio > containerRatio ? width : height * sheetRatio;
		const sheetHeight =
			sheetRatio > containerRatio ? width / sheetRatio : height;

		setSheetSize({ width: sheetWidth, height: sheetHeight });
	}, [sheetRatio]);

	const containerRef = useRef();

	return (
		<div ref={containerRef} className={classes.sheetContainer}>
			<div
				className={classes.sheet}
				style={
					sheetSize && {
						width: `${sheetSize.width}px`,
						height: `${sheetSize.height}px`,
					}
				}
			>
				{children}
			</div>
		</div>
	);
};

export default SheetContainer;
