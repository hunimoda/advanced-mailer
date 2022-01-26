import LetterItemCard from "../../UI/LetterItemCard";
import LetterPreview from "../../UI/LetterPreview";

const InboxItem = ({ className }) => {
	return (
		<LetterItemCard className={className}>
			<LetterPreview />
		</LetterItemCard>
	);
};

export default InboxItem;
