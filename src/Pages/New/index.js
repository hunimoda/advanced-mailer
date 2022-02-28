import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { letterActions } from "../../Context/letter";
import TopHeader from "../../Components/New/TopHeader";
import Sheet from "../../Components/Sheet";
import InnerObject from "../../Components/Letter/InnerObject";
import ToolBox from "../../Components/New/ToolBox";
import { getLetterDocByParams } from "../../Firebase/db";
import { getMyUid } from "../../Firebase/auth";
import { isEqual } from "lodash";
import classes from "./index.module.css";

const New = () => {
	const mainRef = useRef();
	const id = new URLSearchParams(window.location.search).get("id");

	const dispatch = useDispatch();

	const letter = useSelector((state) => state.letter);
	const sheet = useSelector((state) => state.letter.sheet);
	const aspectRatio = useSelector((state) => state.letter.sheet.aspectRatio);
	const objects = useSelector((state) => state.letter.objects);
	const draftLetters = useSelector((state) => state.page.drafts.letters);

	const [selectedId, setSelectedId] = useState(null);
	const [objectIdsList, setObjectIdsList] = useState([]);

	const updatedObjectIdsList = Object.keys(letter.objects).sort();

	useEffect(() => {
		if (!isEqual(objectIdsList, updatedObjectIdsList)) {
			const newObjectId = updatedObjectIdsList.filter(
				(id) => !objectIdsList.includes(id)
			)[0];

			if (newObjectId) {
				setSelectedId(newObjectId);
			}
			setObjectIdsList(updatedObjectIdsList);
		}
	}, [updatedObjectIdsList, objectIdsList]);

	useEffect(() => {
		if (id) {
			let draftLetter = draftLetters.filter(
				(letterDoc) => letterDoc.id === id
			)[0];

			if (!draftLetter) {
				getLetterDocByParams(getMyUid(), id, "drafts").then((letterDoc) => {
					if (letterDoc) {
						dispatch(letterActions.setLetterState(letterDoc.letter));
					} else {
						console.log("We don't have the letter");
					}
				});
			} else {
				dispatch(letterActions.setLetterState(draftLetter.letter));
			}
		}
	}, [draftLetters, id, dispatch]);

	useEffect(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			const mainEntry = entries[0];

			let width = null;
			let height = null;

			if (mainEntry.contentBoxSize) {
				const contentBoxSize = Array.isArray(mainEntry.contentBoxSize)
					? mainEntry.contentBoxSize[0]
					: mainEntry.contentBoxSize;

				width = contentBoxSize.inlineSize;
				height = contentBoxSize.blockSize;
			} else {
				const contentRect = mainEntry.contentRect;

				width = contentRect.width;
				height = contentRect.height;
			}

			const containerRatio = width / height;

			const sheetWidth =
				aspectRatio > containerRatio ? width : height * aspectRatio;
			const sheetHeight =
				aspectRatio > containerRatio ? width / aspectRatio : height;

			dispatch(
				letterActions.setSheetSize({ width: sheetWidth, height: sheetHeight })
			);
		});

		const mainElem = mainRef.current;
		resizeObserver.observe(mainElem);

		return () => resizeObserver.unobserve(mainElem);
	}, [dispatch, aspectRatio]);

	useEffect(
		() => window.addEventListener("touchstart", () => setSelectedId(null)),
		[]
	);

	const onSelectChange = (id, select) => setSelectedId(select ? id : null);

	return (
		<>
			<TopHeader />
			<main ref={mainRef} className={classes.main}>
				<Sheet sheet={sheet}>
					{Object.entries(objects).map(([id, object]) => (
						<InnerObject
							key={id}
							id={id}
							onSelectChange={onSelectChange}
							selected={id === selectedId}
							dispatch={dispatch}
							sheetSize={sheet.size}
							object={object}
						/>
					))}
				</Sheet>
			</main>
			<ToolBox />
		</>
	);
};

export default New;
