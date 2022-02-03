import { useState, useEffect } from "react";
import { getSentLetters } from "../../Firebase/db";
import TitleBar from "../../Components/TitleBar";
import LetterList from "../../UI/LetterList";
import SentItem from "../../Components/SentItem";
import MoreLetters from "../../Components/MoreLetters";

const Sent = () => {
	const [sentItems, setSentItems] = useState([]);
	console.log(sentItems);

	useEffect(
		() => getSentLetters().then((sentLetters) => setSentItems(sentLetters)),
		[]
	);

	return (
		<>
			<TitleBar>보낸 편지함</TitleBar>
			<LetterList>
				{sentItems.map((sentItem) => (
					<SentItem
						key={sentItem.id}
						id={sentItem.id}
						description={sentItem.description}
					/>
				))}
			</LetterList>
			<MoreLetters status="none" />
		</>
	);
};

export default Sent;
