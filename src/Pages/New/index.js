import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { letterActions } from "../../Context/letter";
import TopHeader from "../../Components/New/TopHeader";
import Sheet from "../../Components/Sheet";
import InnerObject from "../../Components/Letter/InnerObject";
import ToolBox from "../../Components/New/ToolBox";
import { getLetterDocByParams } from "../../Firebase/db";
import { getMyUid } from "../../Firebase/auth";
import { isEqual } from "lodash";
import classes from "./index.module.css";

const CANVAS_SCALE_FACTOR = 2;

let brushWidth = 3;
let isBrushWidthConstant = true;
const BRUSH_SCALE_FACTOR = 4;

let context = null;
let coords = [];
let pressureRecords = [];
const SMOOTHING_FACTOR = 0.8;

const New = () => {
	const mainRef = useRef();
	const id = new URLSearchParams(window.location.search).get("id");

	const dispatch = useDispatch();

	const letter = useSelector((state) => state.letter);
	const sheet = useSelector((state) => state.letter.sheet);
	const aspectRatio = useSelector((state) => state.letter.sheet.aspectRatio);
	const objects = useSelector((state) => state.letter.objects);
	const draftLetters = useSelector((state) => state.page.drafts.letters);

	const [selectedId, setSelectedId] = useState(null);
	const [objectIdsList, setObjectIdsList] = useState([]);

	const updatedObjectIdsList = Object.keys(letter.objects).sort();

	useEffect(() => {
		if (!isEqual(objectIdsList, updatedObjectIdsList)) {
			const newObjectId = updatedObjectIdsList.filter(
				(id) => !objectIdsList.includes(id)
			)[0];

			if (newObjectId) {
				setSelectedId(newObjectId);
			}
			setObjectIdsList(updatedObjectIdsList);
		}
	}, [updatedObjectIdsList, objectIdsList]);

	useEffect(() => {
		if (id) {
			let draftLetter = draftLetters.filter(
				(letterDoc) => letterDoc.id === id
			)[0];

			if (!draftLetter) {
				getLetterDocByParams(getMyUid(), id, "drafts").then((letterDoc) => {
					if (letterDoc) {
						dispatch(letterActions.setLetterState(letterDoc.letter));
					} else {
						console.log("We don't have the letter");
					}
				});
			} else {
				dispatch(letterActions.setLetterState(draftLetter.letter));
			}
		}
	}, [draftLetters, id, dispatch]);

	useEffect(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			const mainEntry = entries[0];

			let width = null;
			let height = null;

			if (mainEntry.contentBoxSize) {
				const contentBoxSize = Array.isArray(mainEntry.contentBoxSize)
					? mainEntry.contentBoxSize[0]
					: mainEntry.contentBoxSize;

				width = contentBoxSize.inlineSize;
				height = contentBoxSize.blockSize;
			} else {
				const contentRect = mainEntry.contentRect;

				width = contentRect.width;
				height = contentRect.height;
			}

			const containerRatio = width / height;

			const sheetWidth =
				aspectRatio > containerRatio ? width : height * aspectRatio;
			const sheetHeight =
				aspectRatio > containerRatio ? width / aspectRatio : height;

			dispatch(
				letterActions.setSheetSize({ width: sheetWidth, height: sheetHeight })
			);
		});

		const mainElem = mainRef.current;
		resizeObserver.observe(mainElem);

		return () => resizeObserver.unobserve(mainElem);
	}, [dispatch, aspectRatio]);

	const onSelectChange = (id, select) => setSelectedId(select ? id : null);

	const canvasRef = useRef();

	const [pointerType, setPointerType] = useState(null);

	useEffect(
		() =>
			window.addEventListener("pointerdown", (event) => {
				if (event.pointerType === "touch") {
					setSelectedId(null);
				}
			}),
		[]
	);

	useEffect(() => {
		window.addEventListener("pointerup", (event) => {
			if (event.pointerType === "touch") {
				setPointerType(null);
			}
		});
	}, []);

	const canvas = canvasRef.current;

	useEffect(() => {
		if (canvas) {
			context = canvas.getContext("2d");
			context.strokeStyle = "black";
			context.lineCap = "round";
			context.lineJoin = "round";
		}
	}, [canvas]);

	const getTouchPositionFromEvent = (event) => {
		const canvas = event.currentTarget.getBoundingClientRect();

		return {
			x: CANVAS_SCALE_FACTOR * (event.touches[0].clientX - canvas.x),
			y: CANVAS_SCALE_FACTOR * (event.touches[0].clientY - canvas.y),
		};
	};

	const getMiddlePosition = (pos1, pos2) => {
		return {
			x: (pos1.x + pos2.x) / 2,
			y: (pos1.y + pos2.y) / 2,
		};
	};

	const getLineWidth = (pressure) => {
		if (isBrushWidthConstant) {
			return CANVAS_SCALE_FACTOR * brushWidth;
		}

		return (
			CANVAS_SCALE_FACTOR *
			((BRUSH_SCALE_FACTOR - 1) * brushWidth * Math.pow(pressure, 2) +
				brushWidth)
		);
	};

	const getLinearPressureAtT = (start, end, t) => (1 - t) * start + t * end;

	const getLinearPositionAtT = (start, end, t) => {
		const x = (1 - t) * start.x + t * end.x;
		const y = (1 - t) * start.y + t * end.y;

		return { x, y };
	};

	const drawLine = () => {
		// coords[0] -> coords[1]
		if (isBrushWidthConstant) {
			context.beginPath();

			context.moveTo(coords[0].x, coords[0].y);
			context.lineTo(coords[1].x, coords[1].y);

			context.lineWidth = getLineWidth();
			context.stroke();
		} else {
			for (let i = 0; i < 1000; i++) {
				const subStartPoint = getLinearPositionAtT(
					coords[0],
					coords[1],
					i / 10000
				);
				const subEndPoint = getLinearPositionAtT(
					coords[0],
					coords[1],
					(i + 1) / 1000
				);
				const pressure = getLinearPressureAtT(
					pressureRecords[0],
					pressureRecords[1],
					i / 1000
				);

				context.beginPath();

				context.moveTo(subStartPoint.x, subStartPoint.y);
				context.lineTo(subEndPoint.x, subEndPoint.y);

				context.lineWidth = getLineWidth(pressure);
				context.stroke();
			}
		}
	};

	const getQuadraticPressureAtT = (start, control, end, t) => {
		// if (0 <= t && t < 0.5) {
		// 	return getLinearPressureAtT(start, control, 2 * t);
		// } else {
		// 	return getLinearPressureAtT(control, end, 2 * (t - 0.5));
		// }
		return (
			Math.pow(1 - t, 2) * start +
			2 * (1 - t) * t * control +
			Math.pow(t, 2) * end
		);
	};

	const getQuadraticPositionAtT = (start, control, end, t) => {
		const x =
			Math.pow(1 - t, 2) * start.x +
			2 * (1 - t) * t * control.x +
			Math.pow(t, 2) * end.x;
		const y =
			Math.pow(1 - t, 2) * start.y +
			2 * (1 - t) * t * control.y +
			Math.pow(t, 2) * end.y;

		return { x, y };
	};

	const drawCurve = () => {
		// coords[0] -> (coords[1]) -> coords[2]

		if (isBrushWidthConstant) {
			context.beginPath();

			context.moveTo(coords[0].x, coords[0].y);
			context.quadraticCurveTo(
				coords[1].x,
				coords[1].y,
				coords[2].x,
				coords[2].y
			);

			context.lineWidth = getLineWidth();
			context.stroke();
		} else {
			for (let i = 0; i < 1000; i++) {
				const subStartPoint = getQuadraticPositionAtT(
					coords[0],
					coords[1],
					coords[2],
					i / 1000
				);
				const subEndPoint = getQuadraticPositionAtT(
					coords[0],
					coords[1],
					coords[2],
					(i + 1) / 1000
				);
				const pressure = getQuadraticPressureAtT(
					pressureRecords[0],
					pressureRecords[1],
					pressureRecords[2],
					i / 1000
				);

				context.beginPath();

				context.moveTo(subStartPoint.x, subStartPoint.y);
				context.lineTo(subEndPoint.x, subEndPoint.y);

				context.lineWidth = getLineWidth(pressure);
				context.stroke();
			}
		}
	};

	const onPointerDown = (event) => {
		console.log("pointer-down");
		event.preventDefault();

		setPointerType(event.pointerType);
		pressureRecords.push(event.pressure);
	};

	const onPointerMove = (event) => {
		console.log("pointer-move");
		event.preventDefault();

		const prevPressure = pressureRecords[pressureRecords.length - 1];
		const newPressure =
			SMOOTHING_FACTOR * event.pressure + (1 - SMOOTHING_FACTOR) * prevPressure;
		const midPressure = (prevPressure + newPressure) / 2;

		pressureRecords.push(midPressure, newPressure);
		pressureRecords = pressureRecords.slice(-4);
	};

	const onTouchStart = (event) => {
		console.log("touch-start");
		if (pointerType !== "pen") {
			return;
		}

		event.preventDefault();
		coords.push(getTouchPositionFromEvent(event));
	};

	const onTouchMove = (event) => {
		console.log("touch-move");
		if (pointerType !== "pen") {
			return;
		}

		event.preventDefault();
		const newCoord = getTouchPositionFromEvent(event);
		const midCoord = getMiddlePosition(coords[coords.length - 1], newCoord);

		coords.push(midCoord, newCoord);
		coords = coords.slice(-4);

		if (coords.length < 4) {
			drawLine();
		} else {
			drawCurve();
		}
	};

	const onTouchEnd = (event) => {
		console.log("touch-end");
		if (pointerType !== "pen") {
			return;
		}

		event.preventDefault();
		coords = coords.slice(-2);

		if (coords.length === 2) {
			drawLine();
		}

		coords = [];
		pressureRecords = [];

		setPointerType(null);
	};

	const onSelectPen = (pen) => {
		if (pen.color) {
			context.strokeStyle = pen.color;
		} else if (pen.size) {
			brushWidth = pen.size;
		} else if (pen.style) {
			isBrushWidthConstant = pen.style === "constant";
		}

		context.globalCompositeOperation = "source-over";
	};

	const onSelectEraser = (size) => {
		if (size) {
			brushWidth = size;
		}

		context.globalCompositeOperation = "destination-out";
		context.strokeStyle = "rgba(255, 255, 255, 1)";
	};

	function isCanvasBlank() {
		const pixelBuffer = new Uint32Array(
			context.getImageData(0, 0, canvas.width, canvas.height).data.buffer
		);

		return !pixelBuffer.some((color) => color !== 0);
	}

	return (
		<>
			<TopHeader onSelectPen={onSelectPen} onSelectEraser={onSelectEraser} />
			<main ref={mainRef} className={classes.main}>
				<Sheet
					sheet={sheet}
					// onPointerDown={onPointerDown}
					// onPointerMove={onPointerMove}
					// onTouchStart={onTouchStart}
					// onTouchMove={onTouchMove}
					// onTouchEnd={onTouchEnd}
				>
					{Object.entries(objects).map(([id, object]) => (
						<InnerObject
							key={id}
							id={id}
							onSelectChange={onSelectChange}
							selected={id === selectedId}
							dispatch={dispatch}
							sheetSize={sheet.size}
							object={object}
						/>
					))}
					{sheet.size && (
						<canvas
							ref={canvasRef}
							className={classes.canvas}
							width={CANVAS_SCALE_FACTOR * sheet.size.width}
							height={CANVAS_SCALE_FACTOR * sheet.size.height}
						></canvas>
					)}
					<button onClick={() => console.log(canvas.toDataURL())}>Done</button>
				</Sheet>
			</main>
			<ToolBox />
		</>
	);
};

export default New;
