import LetterList from "../../UI/LetterList";
import TitleBar from "../../Components/TitleBar";
import InboxItem from "../../Components/InboxItem";
import MoreLetters from "../../Components/MoreLetters";

const Inbox = () => {
	return (
		<>
			<TitleBar>받은 편지함</TitleBar>
			<LetterList>
				<InboxItem />
				<InboxItem />
				<InboxItem />
			</LetterList>
			<MoreLetters status="none" />
		</>
	);
};

export default Inbox;
