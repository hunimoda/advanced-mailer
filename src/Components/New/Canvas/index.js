import { useRef, useEffect, useState } from "react";
import classes from "./index.module.css";

const SCALE_FACTOR = 2;
const FILTER_LENGTH = 10;

const MIN_BRUSH_WIDTH = 2;
const THRESHOLD_PRESSURE = 0.4;
const BRUSH_WIDTH_GRAD = 5;

let context = null;
let coords = [];
let pressureRecords = [];

const Canvas = ({ size }) => {
	const canvasRef = useRef();

	const { width, height } = size;
	const [pointerType, setPointerType] = useState(null);

	useEffect(() => {
		window.addEventListener("pointerup", (event) => {
			if (event.pointerType === "touch") {
				setPointerType(null);
			}
		});
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;

		canvas.width = width * SCALE_FACTOR;
		canvas.height = height * SCALE_FACTOR;

		context = canvas.getContext("2d");
		context.strokeStyle = "black";
		context.shadowColor = "black";
		context.lineCap = "round";
		context.lineJoin = "round";
	}, [width, height]);

	const getTouchPositionFromEvent = (event) => {
		const canvas = event.currentTarget.getBoundingClientRect();

		return {
			x: SCALE_FACTOR * (event.touches[0].clientX - canvas.x),
			y: SCALE_FACTOR * (event.touches[0].clientY - canvas.y),
		};
	};

	const getMiddlePosition = (pos1, pos2) => {
		return {
			x: (pos1.x + pos2.x) / 2,
			y: (pos1.y + pos2.y) / 2,
		};
	};

	const getLineWidth = () => {
		const weighedSum = pressureRecords.reduce(
			(prevValue, currValue, currIndex) =>
				prevValue + (currIndex + 1) * currValue,
			0
		);
		const weighedAvgPressure =
			(2 * weighedSum) /
				pressureRecords.length /
				(pressureRecords.length + 1) || 0;

		return (
			SCALE_FACTOR *
			Math.max(
				MIN_BRUSH_WIDTH,
				BRUSH_WIDTH_GRAD * (weighedAvgPressure - THRESHOLD_PRESSURE) +
					MIN_BRUSH_WIDTH
			)
		);
	};

	const drawCurve = (mode) => {
		context.beginPath();
		context.moveTo(coords[0].x, coords[0].y);

		if (mode === "straight") {
			context.lineTo(coords[1].x, coords[1].y);
		} else {
			context.quadraticCurveTo(
				coords[1].x,
				coords[1].y,
				coords[2].x,
				coords[2].y
			);
		}
		context.lineWidth = getLineWidth();
		context.shadowBlur = context.lineWidth * 0.2;
		context.stroke();
	};

	const onPointerDown = (event) => {
		event.preventDefault();
		setPointerType(event.pointerType);
	};

	const onPointerMove = (event) => {
		pressureRecords.push(event.pressure);

		if (pressureRecords.length > FILTER_LENGTH) {
			pressureRecords.shift();
		}
	};

	const onTouchStart = (event) => {
		event.preventDefault();

		if (pointerType !== "pen") {
			return;
		}

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

		drawCurve(coords.length < 4 ? "straight" : "curve");
	};

	const onTouchEnd = (event) => {
		event.preventDefault();

		if (pointerType !== "pen") {
			return;
		}

		coords = coords.slice(-2);
		if (coords.length === 2) {
			drawCurve("straight");
		}

		coords = [];
		pressureRecords = [];

		setPointerType(null);
	};

	return (
		<>
			<h1 style={{ position: "fixed", zIndex: 1, top: 100, left: 100 }}>
				{pointerType}
			</h1>
			<canvas
				ref={canvasRef}
				className={classes.canvas}
				onTouchStart={onTouchStart}
				onTouchMove={onTouchMove}
				onTouchEnd={onTouchEnd}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
			></canvas>
		</>
	);
};

export default Canvas;
