import { useRef, useState, useEffect, useReducer } from "react";
import TopHeader from "../../Components/New/TopHeader";
import Sheet from "../../Components/Sheet";
import InnerObject from "../../Components/Letter/InnerObject";
import ToolBox from "../../Components/New/ToolBox";
import classes from "./index.module.css";

const INIT_SHEET = {
	aspectRatio: 0.75,
	backgroundColor: "pink",
	objects: {
		temp: {
			selected: false,
			type: "text",
			value:
				"오늘은 3.1절입니다.\n독립열사들의 정신을 기리며\n조국을 수호합시다!",
			style: {
				backgroundColor: "white",
				fontFamily: "monospace",
				height: 0.2,
				left: 0.1,
				lineHeight: 1.5,
				textAlign: "center",
				top: 0.1,
				transform: {
					scale: 0.02,
					rotate: 10,
				},
				width: 0.8,
				zIndex: 1,
			},
		},
		// another: {
		// 	selected: false,
		// 	type: "image",
		// 	value: "https://place-hold.it/300x500",
		// 	style: {
		// 		left: 0.1,
		// 		top: 0.5,
		// 		height: 0.5,
		// 		width: 0.4,
		// 		zIndex: 2,
		// 	},
		// },
	},
};

const generateObjectId = () => {
	const idxArray = [];
	const ID_CHARS =
		"-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";

	let timestamp = Date.now();

	while (timestamp > 0) {
		idxArray.unshift(timestamp % 64);
		timestamp = Math.floor(timestamp / 64);
	}

	for (let i = 0; i < 16; i++) {
		idxArray.push(Math.floor(Math.random() * 64));
	}

	return idxArray.map((idx) => ID_CHARS[idx]).join("");
};

let maxZIndex = 0;

const reducer = (state, { type, payload }) => {
	const newObjects = JSON.parse(JSON.stringify(state));

	if (type === "ADD_TEXT") {
		newObjects[generateObjectId()] = {
			type: "text",
			value: "",
			style: {
				width: 0.5,
				height: 0.1,
				top: 0.45,
				left: 0.25,
				backgroundColor: "rgba(0, 0, 0, 0.3)",
				transform: {
					scale: 0.04,
					rotate: 0,
				},
				zIndex: ++maxZIndex,
			},
		};
	} else if (type === "ADD_IMAGE") {
		const { src, imageRatio, sheetRatio } = payload;

		const width = Math.min(1, imageRatio / sheetRatio) / 2;
		const height = Math.min(1, sheetRatio / imageRatio) / 2;

		newObjects[generateObjectId()] = {
			type: "image",
			value: src,
			style: {
				width,
				height,
				top: 0.5 - height / 2,
				left: 0.5 - width / 2,
				backgroundColor: "rgba(0, 0, 0, 0.3)",
				transform: {
					scale: 0.04,
					rotate: 0,
				},
				zIndex: ++maxZIndex,
			},
		};
	} else if (type === "MOVE_OBJECT") {
		const { id, disposition } = payload;

		newObjects[id].style.top += disposition.top;
		newObjects[id].style.left += disposition.left;
	} else if (type === "DELETE_OBJECT") {
		delete newObjects[payload]; // payload = id
	} else if (type === "UPDATE_Z_INDEX") {
		newObjects[payload].style.zIndex = ++maxZIndex; // payload = id
	} else if (type === "RESIZE_OBJECT") {
		const { id, scale, angle } = payload;

		newObjects[id].style.width *= scale;
		newObjects[id].style.height *= scale;
		newObjects[id].style.transform.rotate += angle;
	}

	return newObjects;
};

const New = () => {
	const mainRef = useRef();
	const sheetRef = useRef();

	const [sheetSize, setSheetSize] = useState(null);
	const [aspectRatio, setAspectRatio] = useState(INIT_SHEET.aspectRatio);
	const [backgroundColor, setBackgroundColor] = useState(
		INIT_SHEET.backgroundColor
	);
	const [selectedId, setSelectedId] = useState("temp");

	const [objects, dispatch] = useReducer(reducer, INIT_SHEET.objects);

	useEffect(() => {
		const deselectAllObjects = () => setSelectedId(null);

		window.addEventListener("touchstart", deselectAllObjects);

		return () => window.removeEventListener("touchstart", deselectAllObjects);
	}, []);

	useEffect(() => {
		const { offsetWidth: width, offsetHeight: height } = mainRef.current;
		const containerRatio = width / height;

		const sheetWidth =
			aspectRatio > containerRatio ? width : height * aspectRatio;
		const sheetHeight =
			aspectRatio > containerRatio ? width / aspectRatio : height;

		setSheetSize({ width: sheetWidth, height: sheetHeight });
	}, [aspectRatio]);

	const onObjectMove = (id, disposition) =>
		dispatch({ type: "MOVE_OBJECT", payload: { id, disposition } });

	const onObjectResize = (id, position, oldPosition) => {
		const vectorDifference = (position1, position2) => {
			return {
				x: position1.x - position2.x,
				y: position1.y - position2.y,
			};
		};
		const vectorLength = (disposition) =>
			Math.sqrt(Math.pow(disposition.x, 2) + Math.pow(disposition.y, 2));

		const { left: sheetLeft, top: sheetTop } =
			sheetRef.current.getBoundingClientRect();
		const centerPosition = {
			x: objects[id].style.left * sheetSize.width + sheetLeft,
			y: objects[id].style.top * sheetSize.height + sheetTop,
		};

		const newVector = vectorDifference(position, centerPosition);
		const oldVector = vectorDifference(oldPosition, centerPosition);
		const diffVector = vectorDifference(newVector, oldVector);

		const newLength = vectorLength(newVector);
		const oldLength = vectorLength(oldVector);
		const diffLength = vectorLength(diffVector);

		if (newLength === 0) {
			return;
		}

		const scale = newLength / oldLength;
		const angle =
			(Math.acos(
				(-Math.pow(diffLength, 2) +
					Math.pow(newLength, 2) +
					Math.pow(oldLength, 2)) /
					(2 * newLength * oldLength)
			) *
				180) /
			Math.PI;
		const direction = Math.sign(
			newVector.y * oldVector.x - newVector.x * oldVector.y
		);

		dispatch({
			type: "RESIZE_OBJECT",
			payload: { id, scale, angle: direction * angle },
		});
	};

	const onObjectDelete = (id) => {
		dispatch({ type: "DELETE_OBJECT", payload: id });
		setSelectedId(null);
	};

	const onObjectSelect = (id) => {
		if (id !== selectedId) {
			setSelectedId(id);
			dispatch({ type: "UPDATE_Z_INDEX", payload: id });
		}
	};

	return (
		<>
			<TopHeader />
			<main ref={mainRef} className={classes.main}>
				{sheetSize && (
					<Sheet
						ref={sheetRef}
						size={sheetSize}
						backgroundColor={backgroundColor}
					>
						{Object.entries(objects).map(([id, object]) => (
							<InnerObject
								key={id}
								id={id}
								object={object}
								sheetSize={sheetSize}
								onMove={onObjectMove}
								onResize={onObjectResize}
								onDelete={onObjectDelete}
								onSelect={onObjectSelect}
								selected={id === selectedId}
							/>
						))}
					</Sheet>
				)}
			</main>
			<ToolBox />
		</>
	);
};

export default New;
