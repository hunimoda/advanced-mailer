import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { letterActions } from "../../Context/letter";
import { getLetterDocByParams } from "../../Firebase/db";
import Sheet from "../../Components/Sheet";
import InnerObject from "../../Components/Letter/InnerObject";
import classes from "./index.module.css";

const Letter = () => {
	const dispatch = useDispatch();
	const letter = useSelector((state) => state.letter);
	const objects = useSelector((state) => state.letter.objects);

	const [sheetSize, setSheetSize] = useState(null);
	// const [letter, setLetter] = useState(null);
	const aspectRatio = letter.sheet.aspectRatio;

	useEffect(() => {
		const { location } = window;
		const params = new URLSearchParams(location.search);

		const uid = params.get("uid");
		const id = params.get("id");

		const updateSheetSize = () => {
			const { width, height } = window.screen;
			const containerRatio = width / height;

			const sheetWidth =
				aspectRatio > containerRatio ? width : height * aspectRatio;
			const sheetHeight =
				aspectRatio > containerRatio ? width / aspectRatio : height;

			dispatch(
				letterActions.setSheetSize({ width: sheetWidth, height: sheetHeight })
			);
		};

		getLetterDocByParams(uid, id).then((doc) => {
			if (doc) {
				dispatch(letterActions.setLetterState(doc.letter));
				updateSheetSize();
				// setLetter(letter);

				// const {
				// 	width: screenWidth,
				// 	height: screenHeight,
				// 	orientation,
				// } = screen;

				// const updateSheetSize = () => {
				// 	const screenRatio = screenWidth / screenHeight;
				// 	const sheetRatio = letter.sheet.aspectRatio;

				// 	const width =
				// 		sheetRatio > screenRatio ? screenWidth : screenHeight * sheetRatio;
				// 	const height =
				// 		sheetRatio > screenRatio ? screenWidth / sheetRatio : screenHeight;

				// 	setSheetSize({ width, height });
				// };

				// updateSheetSize();
				// orientation.addEventListener("change", () => updateSheetSize());
			} else {
				console.log("Letter doesn't exist!");
			}
		});

		window.screen.orientation.onchange = updateSheetSize;
	}, [dispatch, aspectRatio]);

	const onGoBackClick = () => {
		// const { pathname } = window.location;
		// if (pathname.startsWith("/sent")) {
		// 	history.push("/sent");
		// } else if (pathname.startsWith("/inbox")) {
		// 	history.push("/inbox");
		// } else {
		// 	history.push("/");
		// }
	};

	const onDownloadClick = () => {
		// if (user) {
		// 	//
		// } else {
		// 	console.log("need to login");
		// }
	};

	return (
		<>
			<div className={classes.controls}>
				<button onClick={onGoBackClick}>
					{/* {user ? (
						<i className="fas fa-times" />
					) : (
						<i className="fas fa-home" />
					)} */}
					<i className="fas fa-times" />
				</button>
				{true && (
					<button onClick={onDownloadClick}>
						<i className="fas fa-download" />
					</button>
				)}
			</div>
			<div className={classes.backdrop} />
			<Sheet>
				{Object.entries(objects).map(([id, object]) => (
					<InnerObject key={id} id={id} readOnly={true} />
				))}
			</Sheet>
		</>
	);

	// if (sheetSize === null || letter === null) {
	// 	return null;
	// }

	// const {
	// 	sheet: { backgroundColor, objects },
	// 	description,
	// } = letter;

	// return (
	// 	<LetterSheet
	// 		style={{
	// 			backgroundColor: backgroundColor ?? "transparent",
	// 			width: `${sheetSize.width}px`,
	// 			height: `${sheetSize.height}px`,
	// 		}}
	// 		description={description}
	// 		type={type}
	// 	>
	// 		{objects.map((object, index) => (
	// 			<InnerObject
	// 				key={index}
	// 				type={object.type}
	// 				value={object.value}
	// 				style={object.style}
	// 				sheetSize={sheetSize}
	// 			/>
	// 		))}
	// 	</LetterSheet>
	// );
};

export default Letter;
