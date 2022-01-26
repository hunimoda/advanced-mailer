import TitleBar from "../../Components/TitleBar";
import LetterList from "../../UI/LetterList";
import SentItem from "../../Components/SentItem";

const Sent = () => {
	return (
		<>
			<TitleBar>보낸 편지함</TitleBar>
			<LetterList>
				<SentItem />
			</LetterList>
		</>
	);
};

export default Sent;
