import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLetterById } from "../../Firebase/db";
import LetterSheet from "../../Components/Letter/LetterSheet";
import Object from "../../Components/Letter/Object";

const Letter = () => {
	const { letter: letterId } = useParams();

	const [sheetSize, setSheetSize] = useState(null);
	const [letter, setLetter] = useState(null);

	useEffect(() => {
		getLetterById(letterId).then((letter) => {
			if (letter) {
				setLetter(letter);

				const updateSheetSize = () => {
					const { width: screenWidth, height: screenHeight } = window.screen;
					const screenAspectRatio = screenWidth / screenHeight;
					const sheetAspectRatio = letter.sheet.aspectRatio;

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
				window.screen.orientation.addEventListener("change", () =>
					updateSheetSize()
				);
			} else {
				// Show error message: invalid URL
				console.log("No data!");
			}
		});
	}, [letterId]);

	if (sheetSize === null || letter === null) {
		return null;
	}

	const {
		sheet: { backgroundColor, objects },
		description,
	} = letter;

	return (
		<LetterSheet
			style={{
				backgroundColor: backgroundColor ?? "transparent",
				width: `${sheetSize.width}px`,
				height: `${sheetSize.height}px`,
			}}
			description={description}
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
