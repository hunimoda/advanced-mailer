import { useEffect, useState, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { getLetterDocByParams } from "../../Firebase/db";
import Sheet from "../../Components/Sheet";
import InnerObject from "../../Components/Letter/InnerObject";
import store from "../../Context";
import { getMyUid } from "../../Firebase/auth";
import classes from "./index.module.css";

const getSheetSize = (sheetRatio) => {
	const container = {
		width: window.screen.width,
		height: window.screen.height,
	};
	const containerRatio = container.width / container.height;

	const sheetWidth =
		sheetRatio > containerRatio
			? container.width
			: container.height * sheetRatio;
	const sheetHeight =
		sheetRatio > containerRatio
			? container.width / sheetRatio
			: container.height;

	return { width: sheetWidth, height: sheetHeight };
};

const Letter = ({ type }) => {
	const history = useHistory();

	const [sheet, setSheet] = useState({});
	const [objects, setObjects] = useState({});
	const { id } = useParams();

	const setLetter = (letter) => {
		letter.sheet.size = getSheetSize(letter.sheet.aspectRatio);

		setSheet(letter.sheet);
		setObjects(letter.objects);
	};

	const letterCallback = useCallback((doc) => {
		if (doc) {
			setLetter(doc.letter);
		} else {
			console.log("Letter doesn't exist!");
		}
	}, []);

	useEffect(() => {
		if (!type) {
			const params = new URLSearchParams(window.location.search);
			const uid = params.get("uid");
			const id = params.get("id");

			getLetterDocByParams(uid, id).then(letterCallback);
		} else {
			const letterInStore = store
				.getState()
				.page[type].letters.filter((letter) => letter.id === id)[0]?.letter;

			if (letterInStore) {
				setLetter(JSON.parse(JSON.stringify(letterInStore)));
			} else {
				const uid = getMyUid();

				getLetterDocByParams(uid, id, type).then(letterCallback);
			}
		}
	}, [type, id, letterCallback]);

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
				<button onClick={history.goBack}>
					<i className="fas fa-times" />
				</button>
				{!type && (
					<button onClick={onDownloadClick}>
						<i className="fas fa-download" />
					</button>
				)}
			</div>
			<div className={classes.container}>
				{sheet && objects && (
					<Sheet sheet={sheet}>
						{Object.entries(objects).map(([id, object]) => (
							<InnerObject
								key={id}
								id={id}
								sheetSize={sheet.size}
								object={object}
								readOnly={true}
							/>
						))}
					</Sheet>
				)}
			</div>
		</>
	);
};

export default Letter;
