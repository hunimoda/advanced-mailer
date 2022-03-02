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

const SCALE_FACTOR = 2;
const FILTER_LENGTH = 10;

const MIN_BRUSH_WIDTH = 2;
const THRESHOLD_PRESSURE = 0.4;
const BRUSH_WIDTH_GRAD = 5;

let context = null;
let coords = [];
let pressureRecords = [];

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
			context.shadowColor = "black";
			context.lineCap = "round";
			context.lineJoin = "round";
		}
	}, [canvas]);

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
			<TopHeader />
			<main ref={mainRef} className={classes.main}>
				<Sheet
					sheet={sheet}
					onPointerDown={onPointerDown}
					onPointerMove={onPointerMove}
					onTouchStart={onTouchStart}
					onTouchMove={onTouchMove}
					onTouchEnd={onTouchEnd}
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
							width={SCALE_FACTOR * sheet.size.width}
							height={SCALE_FACTOR * sheet.size.height}
						></canvas>
					)}
				</Sheet>
			</main>
			<ToolBox />
		</>
	);
};

export default New;
