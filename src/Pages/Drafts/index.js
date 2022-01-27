import DraftItem from "../../Components/DraftItem";
import TitleBar from "../../Components/TitleBar";
import LetterList from "../../UI/LetterList";
import MoreLetters from "../../Components/MoreLetters";

const Drafts = () => {
	return (
		<>
			<TitleBar>임시 보관함</TitleBar>
			<LetterList>
				<DraftItem />
				<DraftItem />
				<DraftItem />
				<DraftItem />
			</LetterList>
			<MoreLetters status="none" />
		</>
	);
};

export default Drafts;
