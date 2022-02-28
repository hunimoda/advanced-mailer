import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import classes from "./index.module.css";

let context = null;

const Canvas = () => {
	const canvasRef = useRef();

	const { width, height } = useSelector((state) => state.letter.sheet.size);

	useEffect(() => {
		const canvas = canvasRef.current;

		canvas.width = width;
		canvas.height = height;

		context = canvas.getContext("2d");
		context.strokeStyle = "black";
		context.lineWidth = 2.5;
	}, [width, height]);

	function getPosByEvent(event) {
		const canvas = canvasRef.current.getBoundingClientRect();

		return {
			x: event.touches[0].clientX - canvas.x,
			y: event.touches[0].clientY - canvas.y,
		};
	}

	const onTouchStart = (event) => {
		const { x, y } = getPosByEvent(event);

		context.beginPath();
		context.moveTo(x, y);
	};

	const onTouchMove = (event) => {
		const { x, y } = getPosByEvent(event);

		context.lineTo(x, y);
		context.stroke();
	};

	return createPortal(
		<>
			<div className={classes.backdrop} />
			<canvas
				ref={canvasRef}
				className={classes.canvas}
				style={{ width, height }}
				onTouchStart={onTouchStart}
				onTouchMove={onTouchMove}
			></canvas>
		</>,
		document.getElementById("canvas-root")
	);
};

export default Canvas;
