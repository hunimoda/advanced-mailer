import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { letterActions } from "../../../Context/letter";
import { pageActions } from "../../../Context/page";
import { saveLetterAsDocument } from "../../../Firebase/db";
import { generateLetterId, processLetterBeforeSave } from "./helper";
import classes from "./index.module.css";

const TopHeader = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const letter = useSelector((state) => state.letter);

	const onDoneWritingLetter = async (action) => {
		const letterId = generateLetterId();
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
			<button>
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
