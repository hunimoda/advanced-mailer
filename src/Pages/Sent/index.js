import TitleBar from "../../Components/TitleBar";
import LetterList from "../../UI/LetterList";
import SentItem from "../../Components/SentItem";
import MoreLetters from "../../Components/MoreLetters";

const Sent = () => {
	return (
		<>
			<TitleBar>보낸 편지함</TitleBar>
			<LetterList>
				<SentItem />
			</LetterList>
			<MoreLetters status="none" />
		</>
	);
};

export default Sent;
