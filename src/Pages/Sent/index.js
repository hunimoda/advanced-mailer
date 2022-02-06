import TitleBar from "../../Components/TitleBar";
import LetterList from "../../UI/LetterList";
import SentItem from "../../Components/SentItem";
import MoreLetters from "../../Components/MoreLetters";
import { useLetter } from "../../Hooks/useLetter";

const Sent = () => {
	const { isOldPending, hasNoMoreOlds, onGetOldLetters, letters } = useLetter();

	let oldStatus = null;

	if (isOldPending) {
		oldStatus = "pending";
	} else if (hasNoMoreOlds) {
		oldStatus = "none";
	}

	console.log(isOldPending);

	return (
		<>
			<TitleBar>보낸 편지함</TitleBar>
			<button>최근 편지 가져오기</button>
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
