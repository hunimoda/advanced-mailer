import LetterList from "../../UI/LetterList";
import TitleBar from "../../Components/TitleBar";
import InboxItem from "../../Components/InboxItem";

const Inbox = () => {
	return (
		<>
			<TitleBar>받은 편지함</TitleBar>
			<LetterList>
				<InboxItem />
				<InboxItem />
				<InboxItem />
			</LetterList>
		</>
	);
};

export default Inbox;
