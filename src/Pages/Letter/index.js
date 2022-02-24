import { useEffect, useState, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { getLetterDocByParams, saveLetterToInbox } from "../../Firebase/db";
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
const getUidAndIdFromQueryString = () => {
	const params = new URLSearchParams(window.location.search);
	const uid = params.get("uid");
	const id = params.get("id");

	return { uid, id };
};

const Letter = ({ type }) => {
	const history = useHistory();
	const { id } = useParams();

	const [letterDoc, setLetterDoc] = useState(null);
	const letter = letterDoc?.letter;

	const showLetter = (doc) => {
		doc.letter.sheet.size = getSheetSize(doc.letter.sheet.aspectRatio);
		setLetterDoc(doc);
	};

	const letterCallback = useCallback((doc) => {
		if (doc) {
			showLetter(doc);
		} else {
			console.log("Letter doesn't exist!");
		}
	}, []);

	useEffect(() => {
		if (!type) {
			const { uid, id } = getUidAndIdFromQueryString();

			getLetterDocByParams(uid, id).then(letterCallback);
		} else {
			const letterDocInStore = store
				.getState()
				.page[type].letters.filter((letter) => letter.id === id)[0];

			if (letterDocInStore) {
				showLetter(JSON.parse(JSON.stringify(letterDocInStore)));
			} else {
				const uid = getMyUid();

				getLetterDocByParams(uid, id, type).then(letterCallback);
			}
		}
	}, [type, id, letterCallback]);

	const onDownloadClick = () => {
		if (getMyUid()) {
			const { id } = getUidAndIdFromQueryString();

			saveLetterToInbox(letterDoc, id);
		} else {
			console.log("need to login");
		}
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
				{letter && (
					<Sheet sheet={letter.sheet}>
						{Object.entries(letter.objects).map(([id, object]) => (
							<InnerObject
								key={id}
								id={id}
								sheetSize={letter.sheet.size}
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
