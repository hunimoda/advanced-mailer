import { useRef, useState, useEffect, useReducer } from "react";
import TopHeader from "../../Components/New/TopHeader";
import Sheet from "../../Components/Sheet";
import Object from "../../Components/Letter/Object";
import ToolBox from "../../Components/New/ToolBox";
import classes from "./index.module.css";

const INIT_SHEET = {
	aspectRatio: 0.75,
	backgroundColor: "pink",
	objects: [
		{
			id: "temp",
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
					rotate: 30,
				},
				width: 0.8,
			},
		},
		{
			id: "another",
			type: "image",
			value: "https://place-hold.it/300x500",
			style: {
				left: 0.1,
				top: 0.5,
				height: 0.5,
				width: 0.4,
			},
		},
	],
};

const reducer = (state, action) => {};

const New = () => {
	const [sheet, dispatch] = useReducer(reducer, INIT_SHEET);
	const { aspectRatio, backgroundColor: sheetBgColor, objects } = sheet;

	const [sheetSize, setSheetSize] = useState(null);

	useEffect(() => {
		const { offsetWidth: width, offsetHeight: height } = mainRef.current;
		const containerRatio = width / height;

		const sheetWidth =
			aspectRatio > containerRatio ? width : height * aspectRatio;
		const sheetHeight =
			aspectRatio > containerRatio ? width / aspectRatio : height;

		setSheetSize({ width: sheetWidth, height: sheetHeight });
	}, [aspectRatio]);

	const mainRef = useRef();

	return (
		<>
			<TopHeader />
			<main ref={mainRef} className={classes.main}>
				{sheetSize && (
					<Sheet size={sheetSize} backgroundColor={sheetBgColor}>
						{objects.map((object) => (
							<Object
								key={object.id}
								type={object.type}
								value={object.value}
								style={object.style}
								sheetSize={sheetSize}
								selected={true}
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
