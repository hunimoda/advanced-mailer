import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import classes from "./index.module.css";

let context = null;

const Canvas = () => {
	const canvasRef = useRef();

	const { width, height } = useSelector((state) => state.letter.sheet.size);
	const [show, setShow] = useState(false);

	useEffect(() => {
		const canvas = canvasRef.current;

		canvas.width = width;
		canvas.height = height;

		context = canvas.getContext("2d");
		context.strokeStyle = "red";
		context.lineWidth = 2.5;
	}, [width, height]);

	const onTouchStart = (event) => {
		event.preventDefault();

		setShow(true);
		context.beginPath();
	};

	const onTouchMove = (event) => {
		event.preventDefault();

		const canvas = event.currentTarget.getBoundingClientRect();
		const { x, y } = {
			x: event.touches[0].clientX - canvas.x,
			y: event.touches[0].clientY - canvas.y,
		};

		context.lineTo(x, y);
		context.stroke();
	};

	const onTouchEnd = (event) => {
		event.preventDefault();

		setShow(false);
	};

	return createPortal(
		<>
			{show && (
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
				/>
			)}
			<div className={classes.backdrop} />
			<canvas
				ref={canvasRef}
				className={classes.canvas}
				style={{ width, height }}
				onTouchStart={onTouchStart}
				onTouchMove={onTouchMove}
				onTouchEnd={onTouchEnd}
			></canvas>
		</>,
		document.getElementById("canvas-root")
	);
};

export default Canvas;
