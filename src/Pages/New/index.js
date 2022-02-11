import { useRef, useState, useEffect, useReducer, useCallback } from "react";
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
					rotate: -10,
				},
				width: 0.8,
				zIndex: 1,
			},
		},
		another: {
			selected: false,
			type: "image",
			value: "https://place-hold.it/300x500",
			style: {
				left: 0.1,
				top: 0.5,
				height: 0.5,
				width: 0.4,
				zIndex: 2,
				transform: {
					rotate: 0,
				},
			},
		},
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
		const { id, width, height, angle } = payload;

		newObjects[id].style.width = width;
		newObjects[id].style.height = height;
		newObjects[id].style.transform.rotate = angle;
	} else if (type === "RESIZE_OBJECT_LENGTH") {
		const { id, length, side } = payload;

		newObjects[id].style[side] = length;
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

			setSheetSize({ width: sheetWidth, height: sheetHeight });
		});

		const mainElem = mainRef.current;
		resizeObserver.observe(mainElem);

		return () => resizeObserver.unobserve(mainElem);
	}, [aspectRatio]);

	useEffect(
		() => window.addEventListener("touchstart", () => setSelectedId(null)),
		[]
	);

	const onObjectMove = (id, disposition) =>
		dispatch({ type: "MOVE_OBJECT", payload: { id, disposition } });

	const getCenterPosition = (id) => {
		const { left: sheetLeft, top: sheetTop } =
			sheetRef.current.getBoundingClientRect();

		return {
			x: objects[id].style.left * sheetSize.width + sheetLeft,
			y: objects[id].style.top * sheetSize.height + sheetTop,
		};
	};

	const onObjectResize = (id, position) => {
		const centerPosition = getCenterPosition(id);

		const radialVector = {
			x: position.x - centerPosition.x,
			y: position.y - centerPosition.y,
		};
		const radialLength = Math.sqrt(
			Math.pow(radialVector.x, 2) + Math.pow(radialVector.y, 2)
		);

		if (radialLength === 0) {
			return;
		}

		const radialAngle =
			((Math.sign(radialVector.y) || 1) *
				(Math.acos(radialVector.x / radialLength) * 180)) /
			Math.PI;
		const objectAngleInRadians = Math.atan(
			(objects[id].style.height * sheetSize.height) /
				(objects[id].style.width * sheetSize.width)
		);
		const objectAngle = (objectAngleInRadians * 180) / Math.PI;

		const newWidthInPixels =
			Math.max(radialLength, 30) * Math.cos(objectAngleInRadians);
		const newHeightInPixels =
			Math.max(radialLength, 30) * Math.sin(objectAngleInRadians);

		const thresholdAngle = 0.5;
		const normalizedAngle = (radialAngle - objectAngle + 360) % 360;

		dispatch({
			type: "RESIZE_OBJECT",
			payload: {
				id,
				width: newWidthInPixels / sheetSize.width,
				height: newHeightInPixels / sheetSize.height,
				angle:
					thresholdAngle < normalizedAngle &&
					normalizedAngle < 360 - thresholdAngle
						? normalizedAngle
						: 0,
			},
		});
	};

	const dotProduct = (vector1, vector2) => {
		return vector1.x * vector2.x + vector1.y * vector2.y;
	};

	const onObjectResizeLength = (id, position, isResizeHeight) => {
		const rotateAngle = objects[id].style.transform.rotate;
		const normalVector = {
			x: Math.cos(((rotateAngle + (isResizeHeight ? 90 : 0)) * Math.PI) / 180),
			y: Math.sin(((rotateAngle + (isResizeHeight ? 90 : 0)) * Math.PI) / 180),
		};

		const centerPosition = getCenterPosition(id);
		const lineConstant = -dotProduct(normalVector, centerPosition);

		const signedDistance = dotProduct(normalVector, position) + lineConstant;

		const referencePointAngleInRadians = ((45 + rotateAngle) * Math.PI) / 180;
		const referencePoint = {
			x: centerPosition.x + Math.cos(referencePointAngleInRadians),
			y: centerPosition.y + Math.sin(referencePointAngleInRadians),
		};
		const realSign = Math.sign(
			dotProduct(normalVector, referencePoint) + lineConstant
		);

		if (Math.sign(signedDistance) === realSign) {
			dispatch({
				type: "RESIZE_OBJECT_LENGTH",
				payload: {
					id,
					length:
						Math.max(30, Math.abs(signedDistance)) /
						(isResizeHeight ? sheetSize.height : sheetSize.width),
					side: isResizeHeight ? "height" : "width",
				},
			});
		}
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
								onResizeLength={onObjectResizeLength}
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
