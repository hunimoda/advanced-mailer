import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLetter, addLetter } from "../../Firebase/db";
import LetterSheet from "../../Components/LetterSheet";

// const result = addLetter("NUuWYebcVadYwHylxjRX4D6WMVW2", {
// 	aspectRatio: 1.3333333333333333,
// 	objects: [
// 		{
// 			type: "text",
// 			value:
// 				"Hello World!\n이것은 테스트를 위한 예시 문장입니다.\n사이트가 빨리 완성되었으면 좋겠네요!!",
// 			style: {
// 				backgroundColor: "red",
// 				fontFamily: "consolas",
// 				height: 0.17,
// 				left: 0.1725,
// 				lineHeight: 2.1666,
// 				scale: 0.0216666,
// 				top: 0.296666,
// 				width: 0.4375,
// 			},
// 		},
// 		{
// 			type: "image",
// 			value:
// 				"https://d5nunyagcicgy.cloudfront.net/external_assets/hero_examples/hair_beach_v391182663/original.jpeg",
// 			style: {
// 				height: 0.2,
// 				left: 0.55,
// 				top: 0.386666,
// 				width: 0.2,
// 			},
// 		},
// 	],
// });

// console.log(result);

const Letter = () => {
	const { sender, letter: letterId } = useParams();
	const [sheetSize, setSheetSize] = useState(null);
	const [objects, setObjects] = useState([]);

	useEffect(() => {
		getLetter(sender, letterId).then((letter) => {
			if (letter) {
				const { screen } = window;
				const { aspectRatio: sheetAspectRatio, objects: letterObjects } =
					letter;

				setObjects(letterObjects);

				const updateSheetSize = () => {
					const { width: screenWidth, height: screenHeight } = screen;
					const screenAspectRatio = screenWidth / screenHeight;

					let sheetWidth;
					let sheetHeight;

					if (sheetAspectRatio > screenAspectRatio) {
						sheetWidth = screenWidth;
						sheetHeight = sheetWidth / sheetAspectRatio;
					} else {
						sheetHeight = screenHeight;
						sheetWidth = sheetHeight * sheetAspectRatio;
					}

					setSheetSize({ width: sheetWidth, height: sheetHeight });
				};

				updateSheetSize();

				screen.orientation.addEventListener("change", () => {
					updateSheetSize();
				});
			} else {
				// Show error message: invalid URL
				console.log("No data!");
			}
		});
	}, [sender, letterId]);

	if (sheetSize) {
		return (
			<>
				<div style={{ background: "black", width: "100%", height: "100vh" }} />
				<LetterSheet
					style={{
						background: "white",
						width: `${sheetSize.width}px`,
						height: `${sheetSize.height}px`,
					}}
				>
					{objects.map((object, index) => {
						// const style = {};
						// const scale = object.style.scale;

						// for (const prop in object.style) {
						// 	let value = object.style[prop];

						// 	switch (prop) {
						// 		case "height":
						// 			value = `${(sheetSize.height * value) / (scale ?? 1)}px`;
						// 			break;
						// 		case "width":
						// 			value = `${(sheetSize.width * value) / (scale ?? 1)}px`;
						// 			break;
						// 		case "top":
						// 		case "left":
						// 			value = `${value * 100}%`;
						// 			break;
						// 		case "scale":
						// 			style.transform = `scale(${scale})`;
						// 			continue;
						// 		default:
						// 	}

						// 	style[prop] = value;
						// }

						// style["position"] = "absolute";
						// style["transformOrigin"] = "top left";
						// style["fontSize"] = `${sheetSize.height}px`;

						// console.log(style);
						switch (object.type) {
							case "image":
								return <img key={index} src={object.value} />;
							case "text":
								return (
									<div key={index} style={{ whiteSpace: "pre-line" }}>
										{object.value}
									</div>
								);
							default:
								return null;
						}
					})}
				</LetterSheet>
			</>
		);
	} else {
		return null;
	}
};

export default Letter;
