import TitleBar from "../../Components/TitleBar";
import LetterList from "../../UI/LetterList";
import SentItem from "../../Components/SentItem";
import MoreLetters from "../../Components/MoreLetters";
import { useLetter } from "../../Hooks/useLetter";

const Sent = () => {
	const {
		isNewPending,
		isOldPending,
		hasNoMoreOlds,
		onGetNewLetters,
		onGetOldLetters,
		letters,
	} = useLetter("sent");

	let oldStatus = null;

	if (isOldPending) {
		oldStatus = "pending";
	} else if (hasNoMoreOlds) {
		oldStatus = "none";
	}

	const newStatus = isNewPending ? "pending" : "";

	console.log(isNewPending);

	return (
		<>
			<TitleBar>보낸 편지함</TitleBar>
			<MoreLetters status={newStatus} />
			<button onClick={onGetNewLetters}>최근 편지 가져오기</button>
			<LetterList>
				{letters.map((sentLetter) => (
					<SentItem
						key={sentLetter.id}
						id={sentLetter.id}
						metaData={sentLetter.metaData}
					/>
				))}
			</LetterList>
			<button onClick={onGetOldLetters}>예전 편지 가져오기</button>
			<MoreLetters status={oldStatus} />
		</>
	);
};

export default Sent;
