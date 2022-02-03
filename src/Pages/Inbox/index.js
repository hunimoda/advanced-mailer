import { useState, useEffect } from "react";
import { getInboxes } from "../../Firebase/db";
import LetterList from "../../UI/LetterList";
import TitleBar from "../../Components/TitleBar";
import InboxItem from "../../Components/InboxItem";
import MoreLetters from "../../Components/MoreLetters";

const Inbox = () => {
	const [inboxItems, setInboxItems] = useState([]);

	useEffect(() => {
		getInboxes().then((inboxes) => setInboxItems(inboxes));
	}, []);

	return (
		<>
			<TitleBar>받은 편지함</TitleBar>
			<LetterList>
				{inboxItems.map((inboxItem) => (
					<InboxItem
						key={inboxItem.id}
						id={inboxItem.id}
						description={inboxItem.description}
					/>
				))}
			</LetterList>
			<MoreLetters status="none" />
		</>
	);
};

export default Inbox;
