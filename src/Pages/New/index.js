import { useState, useEffect, useReducer, useRef } from "react";
import SheetContainer from "../../Components/SheetContainer";
import Object from "../../Components/Letter/Object";
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
				},
				width: 0.8,
			},
		},
	],
};

const reducer = (state, action) => {};

const New = () => {
	const [sheet, dispatch] = useReducer(reducer, INIT_SHEET);

	const { aspectRatio, backgroundColor, objects } = sheet;

	const mainRef = useRef();

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

	return (
		<>
			<header className={classes.topHeader}>
				<button>
					<i className="fas fa-times" />
				</button>
				<div className={classes.controls}>
					<button>저장</button>
					<button>완료</button>
				</div>
			</header>
			<main ref={mainRef} className={classes.workspace}>
				{sheetSize && (
					<SheetContainer
						sheetSize={sheetSize}
						aspectRatio={aspectRatio}
						backgroundColor={backgroundColor}
					>
						{objects.map((object) => (
							<Object
								key={object.id}
								type={object.type}
								value={object.value}
								style={object.style}
								sheetSize={sheetSize}
							/>
						))}
					</SheetContainer>
				)}
			</main>
			<footer className={classes.toolboxFooter}>
				<div className={classes.toolbox}>
					<button>%</button>
					<button>
						<i className="fas fa-times" />
					</button>
					<button>
						<i className="fas fa-times" />
					</button>
					<button>
						<i className="fas fa-times" />
					</button>
					<button>
						<i className="fas fa-times" />
					</button>
					<button>
						<i className="fas fa-times" />
					</button>
					<button>
						<i className="fas fa-times" />
					</button>
				</div>
			</footer>
		</>
	);
};

export default New;
