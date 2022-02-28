import { useState, useEffect } from "react";
import { useHistory, Prompt } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { letterActions, INIT_LETTER } from "../../../Context/letter";
import { pageActions } from "../../../Context/page";
import {
	deleteLetterByTypeAndId,
	saveLetterAsDocument,
} from "../../../Firebase/db";
import { generateLetterId, processLetterBeforeSave } from "./helper";
import { isEqual } from "lodash";
import classes from "./index.module.css";

const TopHeader = () => {
	const history = useHistory();
	const id = new URLSearchParams(window.location.search).get("id");

	const dispatch = useDispatch();
	const letter = useSelector((state) => state.letter);

	const [shouldBlockLeave, setShouldBlockLeave] = useState(false);
	const [leavePage, setLeavePage] = useState(false);

	useEffect(() => {
		const letterCopy = JSON.parse(JSON.stringify(letter));
		const initLetterCopy = JSON.parse(JSON.stringify(INIT_LETTER));

		delete letterCopy.sheet.size;
		delete initLetterCopy.sheet.size;

		setShouldBlockLeave(!isEqual(letterCopy, initLetterCopy));
	}, [letter]);

	useEffect(() => {
		if (shouldBlockLeave) {
			window.onbeforeunload = () => true;
		} else {
			window.onbeforeunload = undefined;
		}
	}, [shouldBlockLeave]);

	useEffect(() => {
		if (!shouldBlockLeave && leavePage) {
			history.goBack();
			dispatch(letterActions.resetLetterState());
		}
	}, [dispatch, history, leavePage, shouldBlockLeave]);

	const onCancel = () => {
		if (shouldBlockLeave) {
			const wantToLeavePage = window.confirm("Do you want to leave the page?");

			if (!wantToLeavePage) {
				return;
			}
			setShouldBlockLeave(false);
		}
		setLeavePage(true);
	};

	const onDoneWritingLetter = async (action) => {
		if (!shouldBlockLeave) {
			alert("입력된 내용이 없습니다");
			return;
		}
		setShouldBlockLeave(false);

		if (id) {
			if (action === "sent") {
				await deleteLetterByTypeAndId("drafts", id);
			}
			dispatch(pageActions.deleteLetterFromPage({ pageName: "drafts", id }));
		}

		const letterId = id ?? generateLetterId();
		const processedLetter = await processLetterBeforeSave(letter, letterId);

		await saveLetterAsDocument(processedLetter, letterId, action);

		history.replace(`/${action}`);
		dispatch(
			pageActions.setNeedsRefresh({ pageName: action, needsRefresh: true })
		);
		dispatch(letterActions.resetLetterState());
	};

	return (
		<>
			<Prompt when={shouldBlockLeave} message="Hello World Prompt" />
			<header className={classes.header}>
				<button onClick={onCancel}>
					<i className="fas fa-times" />
				</button>
				<div className={classes.controls}>
					<button onClick={() => onDoneWritingLetter("drafts")}>저장</button>
					<button onClick={() => onDoneWritingLetter("sent")}>완료</button>
				</div>
			</header>
		</>
	);
};

export default TopHeader;
