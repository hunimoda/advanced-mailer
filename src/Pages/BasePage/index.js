import TitleBar from "../../Components/TitleBar";
import LetterList from "../../UI/LetterList";
import MoreLetters from "../../Components/MoreLetters";
import { useLetter } from "../../Hooks/useLetter";

const BasePage = ({ type, title, item: LetterItem }) => {
	const {
		isNewPending,
		isOldPending,
		hasNoMoreOlds,
		onGetNewLetters,
		onGetOldLetters,
		letters,
	} = useLetter(type);

	let oldStatus = null;

	if (isOldPending) {
		oldStatus = "pending";
	} else if (hasNoMoreOlds) {
		oldStatus = "none";
	}

	const newStatus = isNewPending ? "pending" : "";

	return (
		<>
			<TitleBar>{title}</TitleBar>
			<MoreLetters status={newStatus} />
			<button onClick={onGetNewLetters}>최근 편지 가져오기</button>
			<LetterList>
				{letters.map((letter) => (
					<LetterItem key={letter.id} letter={letter} />
				))}
			</LetterList>
			<button onClick={onGetOldLetters}>예전 편지 가져오기</button>
			<MoreLetters status={oldStatus} />
		</>
	);
};

export default BasePage;
