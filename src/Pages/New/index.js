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

let context = null;
let coords = [];

let timeStamp = null;

const New = () => {
	const mainRef = useRef();
	const id = new URLSearchParams(window.location.search).get("id");

	const dispatch = useDispatch();

	const letter = useSelector((state) => state.letter);
	const sheet = useSelector((state) => state.letter.sheet);
	const aspectRatio = useSelector((state) => state.letter.sheet.aspectRatio);
	const objects = useSelector((state) => state.letter.objects);
	const draftLetters = useSelector((state) => state.page.drafts.letters);

	const sheetSize = sheet.size;

	const [selectedId, setSelectedId] = useState(null);
	const [objectIdsList, setObjectIdsList] = useState([]);
	const [debugString, setDebugString] = useState("");

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

	const onObjectSelect = (id) => setSelectedId(id);

	const canvasRef = useRef();

	// useEffect(
	// 	() =>
	// 		window.addEventListener("pointerdown", (event) => {
	// 			setSelectedId(null);
	// 		}),
	// 	[]
	// );

	useEffect(() => {
		if (sheetSize) {
			canvasRef.current.width = CANVAS_SCALE_FACTOR * sheetSize.width;
			canvasRef.current.height = CANVAS_SCALE_FACTOR * sheetSize.height;

			context = canvasRef.current.getContext("2d");
			context.strokeStyle = "black";
			context.lineCap = "round";
			context.lineJoin = "round";
		}
	}, [canvasRef, sheetSize]);

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

	const getLineWidth = () => CANVAS_SCALE_FACTOR * brushWidth;

	const drawLine = () => {
		// coords[0] -> coords[1]
		context.beginPath();

		context.moveTo(coords[0].x, coords[0].y);
		context.lineTo(coords[1].x, coords[1].y);

		context.lineWidth = getLineWidth();
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

		context.lineWidth = getLineWidth();
		context.stroke();
	};

	const onPointerDown = (event) => {
		if (event.pointerType === "pen") {
			coords.push(getTouchPositionFromEvent(event));
		}
		setSelectedId(null);
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

	const onSelectPen = (pen) => {
		if (pen.color) {
			context.strokeStyle = pen.color;
		} else if (pen.size) {
			brushWidth = pen.size;
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

	// function isCanvasBlank() {
	// 	const pixelBuffer = new Uint32Array(
	// 		context.getImageData(0, 0, canvas.width, canvas.height).data.buffer
	// 	);

	// 	return !pixelBuffer.some((color) => color !== 0);
	// }

	return (
		<>
			<TopHeader onSelectPen={onSelectPen} onSelectEraser={onSelectEraser} />
			<main ref={mainRef} className={classes.main}>
				<Sheet
					sheet={sheet}
					onPointerDown={onPointerDown}
					onPointerMove={onPointerMove}
					onPointerUp={onPointerUp}
				>
					{Object.entries(objects).map(([id, object]) => (
						<InnerObject
							key={id}
							id={id}
							onSelect={onObjectSelect}
							selected={id === selectedId}
							dispatch={dispatch}
							sheetSize={sheet.size}
							object={object}
						/>
					))}
					<canvas
						ref={canvasRef}
						className={classes.canvas}
						// width={CANVAS_SCALE_FACTOR * sheet.size.width}
						// height={CANVAS_SCALE_FACTOR * sheet.size.height}
					></canvas>
					<button
						style={{ width: 100, height: 50, backgroundColor: debugString }}
					></button>
				</Sheet>
			</main>
			<ToolBox />
		</>
	);
};

export default New;
