import { useHistory } from "react-router-dom";
import LetterItemCard from "../../UI/LetterItemCard";
import LetterPreview from "../../UI/LetterPreview";

const InboxItem = ({ id, description }) => {
	const history = useHistory();

	const onShowLetterClick = () => history.push(`/inbox/${id}`);

	return (
		<LetterItemCard>
			<LetterPreview description={description} onClick={onShowLetterClick} />
		</LetterItemCard>
	);
};

export default InboxItem;
