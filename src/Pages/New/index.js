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
				},
			},
		};
	} else if (type === "MOVE_OBJECT") {
		const {
			id,
			disposition: { left, top },
		} = payload;

		newObjects[id].style.top += top;
		newObjects[id].style.left += left;
	} else if (type === "DELETE_OBJECT") {
		const id = payload;

		delete newObjects[id];
	}

	return newObjects;
};

const New = () => {
	const mainRef = useRef();

	const [sheetSize, setSheetSize] = useState(null);

	const [aspectRatio, setAspectRatio] = useState(INIT_SHEET.aspectRatio);
	const [backgroundColor, setBackgroundColor] = useState(
		INIT_SHEET.backgroundColor
	);

	const [selectedId, setSelectedId] = useState("temp");

	const [objects, dispatch] = useReducer(reducer, INIT_SHEET.objects);

	useEffect(() => {
		dispatch({ type: "ADD_TEXT" });
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

	const onObjectDelete = (id) =>
		dispatch({ type: "DELETE_OBJECT", payload: id });

	return (
		<>
			<TopHeader />
			<main ref={mainRef} className={classes.main}>
				{sheetSize && (
					<Sheet size={sheetSize} backgroundColor={backgroundColor}>
						{Object.entries(objects).map(([id, object]) => (
							<InnerObject
								key={id}
								id={id}
								object={object}
								sheetSize={sheetSize}
								onMove={onObjectMove}
								onDelete={onObjectDelete}
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
