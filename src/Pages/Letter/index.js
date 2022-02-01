import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLetter } from "../../Firebase/db";

const Letter = () => {
	const { sender, letter: letterId } = useParams();
	const [sheetSize, setSheetSize] = useState(null);

	console.log(sheetSize);

	useEffect(() => {
		getLetter(sender, letterId).then((letter) => {
			if (letter) {
				const { aspectRatio: sheetAspectRatio, objects } = letter;
				const { screen } = window;

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
				<div
					style={{
						position: "fixed",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: `${sheetSize.width}px`,
						height: `${sheetSize.height}px`,
						background: "white",
					}}
				/>
			</>
		);
	} else {
		return null;
	}
};

export default Letter;
