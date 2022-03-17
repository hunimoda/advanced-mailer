import { useContext } from "react";
import { CanvasContext, CANVAS_SCALE_FACTOR } from "../../Context/canvas";
import classes from "./index.module.css";

let coords = [];
let timeStamp = null;

const Sheet = ({
	children,
	sheet,
	className,
	// onPointerDown,
	// onPointerMove,
	// onPointerUp,
}) => {
	const { context } = useContext(CanvasContext);

	if (!sheet.size) {
		return null;
	}

	const getTouchPositionFromEvent = (event) => {
		const canvas = event.currentTarget.getBoundingClientRect();

		return {
			x: CANVAS_SCALE_FACTOR * (event.clientX - canvas.x),
			y: CANVAS_SCALE_FACTOR * (event.clientY - canvas.y),
		};
	};

	const getMiddlePosition = (pos1, pos2) => {
		return {
			x: (pos1.x + pos2.x) / 2,
			y: (pos1.y + pos2.y) / 2,
		};
	};

	const drawLine = () => {
		// coords[0] -> coords[1]
		context.beginPath();

		context.moveTo(coords[0].x, coords[0].y);
		context.lineTo(coords[1].x, coords[1].y);

		context.stroke();
	};

	const drawCurve = () => {
		// coords[0] -> (coords[1]) -> coords[2]

		context.beginPath();

		context.moveTo(coords[0].x, coords[0].y);
		context.quadraticCurveTo(
			coords[1].x,
			coords[1].y,
			coords[2].x,
			coords[2].y
		);

		context.stroke();
	};

	const onPointerDown = (event) => {
		if (event.pointerType === "pen") {
			coords.push(getTouchPositionFromEvent(event));
		}
		// setSelectedId(null);
	};

	const onPointerMove = (event) => {
		if (event.pointerType === "pen" && event.timeStamp !== timeStamp) {
			const newCoord = getTouchPositionFromEvent(event);
			const midCoord = getMiddlePosition(coords[coords.length - 1], newCoord);

			coords.push(midCoord, newCoord);
			coords = coords.slice(-4);

			if (coords.length < 4) {
				drawLine();
			} else {
				drawCurve();
			}

			timeStamp = event.timeStamp;
		}
	};

	const onPointerUp = (event) => {
		if (event.pointerType === "pen") {
			coords = coords.slice(-2);

			if (coords.length === 2) {
				drawLine();
			}

			coords = [];
			timeStamp = null;
		}
	};

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
