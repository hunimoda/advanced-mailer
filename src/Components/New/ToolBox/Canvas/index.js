import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import classes from "./index.module.css";

let context = null;
let prevCoord = null;

const Canvas = () => {
	const canvasRef = useRef();

	const { width, height } = useSelector((state) => state.letter.sheet.size);
	const [pointerType, setPointerType] = useState(null);
	const [pressure, setPressure] = useState(null);

	useEffect(() => {
		const canvas = canvasRef.current;

		canvas.width = width;
		canvas.height = height;

		context = canvas.getContext("2d");
		context.strokeStyle = "red";
		context.lineCap = "round";
		// context.lineWidth = 2.5;
	}, [width, height]);

	const getTouchPositionFromEvent = (event) => {
		const canvas = event.currentTarget.getBoundingClientRect();

		return {
			x: event.touches[0].clientX - canvas.x,
			y: event.touches[0].clientY - canvas.y,
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
		// context.beginPath();
		prevCoord = getTouchPositionFromEvent(event);
	};

	const onTouchMove = (event) => {
		event.preventDefault();

		if (pointerType !== "pen") {
			return;
		}

		const currCoord = getTouchPositionFromEvent(event);

		context.beginPath();
		context.moveTo(prevCoord.x, prevCoord.y);
		context.lineTo(currCoord.x, currCoord.y);
		context.lineWidth = Math.min(12 * pressure, 3);
		context.stroke();

		prevCoord = currCoord;
	};

	const onTouchEnd = (event) => {
		event.preventDefault();
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
