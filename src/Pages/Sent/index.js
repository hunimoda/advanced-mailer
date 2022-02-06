import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pageActions } from "../../Context/page";
import TitleBar from "../../Components/TitleBar";
import LetterList from "../../UI/LetterList";
import SentItem from "../../Components/SentItem";
import MoreLetters from "../../Components/MoreLetters";
import { getSentLettersBeforeTimestamp } from "../../Firebase/db";

const Sent = () => {
	const dispatch = useDispatch();
	const sent = useSelector((state) => state.page.sent);

	const { letters: sentLetters, startTimestamp, endTimestamp } = sent;

	const [hasMoreLetters, setHasMoreLetters] = useState(true);

	const onGetRecentLettersClick = () => {};

	const onGetPastLettersClick = () => {
		getSentLettersBeforeTimestamp(startTimestamp ?? Date.now(), 1).then(
			(letters) => {
				if (letters.length === 0) {
					setHasMoreLetters(false);
				} else {
					dispatch(pageActions.push(letters));
				}
			}
		);
	};

	return (
		<>
			<TitleBar>보낸 편지함</TitleBar>
			<button onClick={onGetRecentLettersClick}>최근 편지 가져오기</button>
			<LetterList>
				{sentLetters.map((sentLetter) => (
					<SentItem
						key={sentLetter.id}
						id={sentLetter.id}
						metaData={sentLetter.metaData}
					/>
				))}
			</LetterList>
			<button onClick={onGetPastLettersClick}>예전 편지 가져오기</button>
			<MoreLetters status={hasMoreLetters ? null : "none"} />
		</>
	);
};

export default Sent;
