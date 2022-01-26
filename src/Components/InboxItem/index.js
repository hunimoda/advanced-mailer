import LetterItemCard from "../../UI/LetterItemCard";
import LetterPreview from "../LetterPreview";

const InboxItem = ({ className }) => {
	return (
		<LetterItemCard className={className}>
			<LetterPreview />
		</LetterItemCard>
	);
};

export default InboxItem;
