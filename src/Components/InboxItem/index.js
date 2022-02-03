import { useHistory } from "react-router-dom";
import LetterItemCard from "../../UI/LetterItemCard";
import LetterPreview from "../../UI/LetterPreview";

const InboxItem = ({ id, description }) => {
	const history = useHistory();

	const onShowLetterClick = () => history.push(`/${id}`);

	return (
		<LetterItemCard onClick={onShowLetterClick}>
			<LetterPreview description={description} />
		</LetterItemCard>
	);
};

export default InboxItem;
