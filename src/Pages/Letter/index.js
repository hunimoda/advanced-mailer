import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLetter } from "../../Firebase/db";
import LetterSheet from "../../Components/Letter/LetterSheet";
import Object from "../../Components/Letter/Object";

const Letter = () => {
	const { sender, letter: letterId } = useParams();

	const [sheetSize, setSheetSize] = useState(null);
	const [bgColor, setBgColor] = useState(null);
	const [objects, setObjects] = useState(null);

	useEffect(() => {
		getLetter(sender, letterId).then((letter) => {
			if (letter) {
				const { screen } = window;
				const {
					aspectRatio: sheetAspectRatio,
					backgroundColor: sheetBackgroundColor,
					objects: letterObjects,
				} = letter;

				setBgColor(sheetBackgroundColor);
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
				screen.orientation.addEventListener("change", () => updateSheetSize());
			} else {
				// Show error message: invalid URL
				console.log("No data!");
			}
		});
	}, [sender, letterId]);

	if (sheetSize === null || objects === null) {
		return null;
	}

	return (
		<LetterSheet
			style={{
				backgroundColor: bgColor ?? "transparent",
				width: `${sheetSize.width}px`,
				height: `${sheetSize.height}px`,
			}}
		>
			{objects.map((object, index) => (
				<Object
					key={index}
					type={object.type}
					value={object.value}
					style={object.style}
					sheetSize={sheetSize}
				/>
			))}
		</LetterSheet>
	);
};

export default Letter;
