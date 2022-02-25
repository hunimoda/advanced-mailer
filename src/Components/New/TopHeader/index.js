import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { letterActions } from "../../../Context/letter";
import { pageActions } from "../../../Context/page";
import {
	deleteLetterByTypeAndId,
	saveLetterAsDocument,
} from "../../../Firebase/db";
import { generateLetterId, processLetterBeforeSave } from "./helper";
import classes from "./index.module.css";

const TopHeader = () => {
	const history = useHistory();
	const id = new URLSearchParams(window.location.search).get("id");

	const dispatch = useDispatch();
	const letter = useSelector((state) => state.letter);

	const onDoneWritingLetter = async (action) => {
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
		<header className={classes.header}>
			<button onClick={history.goBack}>
				<i className="fas fa-times" />
			</button>
			<div className={classes.controls}>
				<button onClick={() => onDoneWritingLetter("drafts")}>저장</button>
				<button onClick={() => onDoneWritingLetter("sent")}>완료</button>
			</div>
		</header>
	);
};

export default TopHeader;
