import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import classes from "./index.module.css";

const SCALE_FACTOR = 1;
let context = null;
let coords = [];

const Canvas = () => {
	const canvasRef = useRef();

	const { width, height } = useSelector((state) => state.letter.sheet.size);
	const [pointerType, setPointerType] = useState(null);
	const [pressure, setPressure] = useState(null);

	useEffect(() => {
		const canvas = canvasRef.current;

		canvas.width = width * SCALE_FACTOR;
		canvas.height = height * SCALE_FACTOR;

		context = canvas.getContext("2d");
		context.strokeStyle = "red";
		context.lineCap = "round";
		context.lineJoin = "round";
		// context.lineWidth = 2.5;
	}, [width, height]);

	const getTouchPositionFromEvent = (event) => {
		const canvas = event.currentTarget.getBoundingClientRect();

		return {
			x: event.touches[0].clientX - canvas.x,
			y: event.touches[0].clientY - canvas.y,
		};
	};

	const getMiddlePosition = (pos1, pos2) => {
		return {
			x: (pos1.x + pos2.x) / 2,
			y: (pos1.y + pos2.y) / 2,
		};
	};

	const onPointerDown = (event) => {
		event.preventDefault();
		setPointerType(event.pointerType);
	};

	const onPointerMove = (event) => {
		setPressure(event.pressure);
	};

	const onTouchStart = (event) => {
		event.preventDefault();

		if (pointerType !== "pen") {
			return;
		}
		// context.beginPath();
		coords.push(getTouchPositionFromEvent(event));
	};

	const onTouchMove = (event) => {
		event.preventDefault();

		if (pointerType !== "pen") {
			return;
		}

		const newCoord = getTouchPositionFromEvent(event);
		const midCoord = getMiddlePosition(coords[coords.length - 1], newCoord);

		coords.push(midCoord, newCoord);
		coords = coords.slice(-4);

		context.beginPath();
		context.moveTo(SCALE_FACTOR * coords[0].x, SCALE_FACTOR * coords[0].y);

		if (coords.length < 4) {
			context.lineTo(SCALE_FACTOR * coords[1].x, SCALE_FACTOR * coords[1].y);
		} else {
			context.quadraticCurveTo(
				SCALE_FACTOR * coords[1].x,
				SCALE_FACTOR * coords[1].y,
				SCALE_FACTOR * coords[2].x,
				SCALE_FACTOR * coords[2].y
			);
		}
		context.lineWidth = SCALE_FACTOR * Math.max(1, Math.min(12 * pressure, 3));
		context.stroke();
	};

	const onTouchEnd = (event) => {
		event.preventDefault();

		if (pointerType !== "pen") {
			return;
		}

		coords = coords.slice(-2);
		if (coords.length === 2) {
			context.beginPath();
			context.moveTo(SCALE_FACTOR * coords[0].x, SCALE_FACTOR * coords[0].y);
			context.lineTo(SCALE_FACTOR * coords[1].x, SCALE_FACTOR * coords[1].y);
			context.lineWidth =
				SCALE_FACTOR * Math.max(1, Math.min(12 * pressure, 3));
			context.stroke();
		}
		coords = [];
	};

	return createPortal(
		<>
			<div
				style={{
					width: 100,
					height: 100,
					background: "red",
					position: "fixed",
					zIndex: 5,
					top: 100,
					left: 100,
				}}
			>
				{pressure}
			</div>
			<div className={classes.backdrop} />
			<canvas
				ref={canvasRef}
				className={classes.canvas}
				style={{ width, height }}
				onTouchStart={onTouchStart}
				onTouchMove={onTouchMove}
				onTouchEnd={onTouchEnd}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
			></canvas>
		</>,
		document.getElementById("canvas-root")
	);
};

export default Canvas;
