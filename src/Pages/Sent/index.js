import TitleBar from "../../Components/TitleBar";
import SentItem from "../../Components/SentItem";

const Sent = () => {
	return (
		<>
			<TitleBar>보낸 편지함</TitleBar>
			<ul>
				<SentItem />
			</ul>
		</>
	);
};

export default Sent;
