import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLetterByParams } from "../../Firebase/db";
import LetterSheet from "../../Components/Letter/LetterSheet";
import Object from "../../Components/Letter/Object";
import { getMyUid } from "../../Firebase/auth";

const Letter = ({ type }) => {
	const [sheetSize, setSheetSize] = useState(null);
	const [letter, setLetter] = useState(null);

	const { id: letterId } = useParams();

	useEffect(() => {
		const { location, screen } = window;
		const params = new URLSearchParams(location.search);

		const uid = type ? getMyUid() : params.get("uid");
		const id = type ? letterId : params.get("id");

		if (!id || !uid) {
			console.log("Invalid url");
		} else {
			getLetterByParams(uid, type ?? "sent", id).then((letter) => {
				if (letter) {
					setLetter(letter);

					const {
						width: screenWidth,
						height: screenHeight,
						orientation,
					} = screen;

					const updateSheetSize = () => {
						const screenRatio = screenWidth / screenHeight;
						const sheetRatio = letter.sheet.aspectRatio;

						const width =
							sheetRatio > screenRatio
								? screenWidth
								: screenHeight * sheetRatio;
						const height =
							sheetRatio > screenRatio
								? screenWidth / sheetRatio
								: screenHeight;

						setSheetSize({ width, height });
					};

					updateSheetSize();
					orientation.addEventListener("change", () => updateSheetSize());
				} else {
					console.log("Letter doesn't exist!");
				}
			});
		}
	}, [letterId, type]);

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
