import { useHistory } from "react-router";
import LetterItemCard from "../../UI/LetterItemCard";
import LetterPreview from "../../UI/LetterPreview";

const InboxItem = ({ letter }) => {
	const history = useHistory();

	const onShowLetterClick = () => history.push(`/inbox/${letter.id}`);

	return (
		<LetterItemCard>
			<LetterPreview letter={letter} onClick={onShowLetterClick} />
		</LetterItemCard>
	);
};

export default InboxItem;
