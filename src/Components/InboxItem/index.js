import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import { pageActions } from "../../Context/page";
import LetterItemCard from "../../UI/LetterItemCard";
import LetterPreview from "../../UI/LetterPreview";

const InboxItem = ({ letter }) => {
	const history = useHistory();
	const dispatch = useDispatch();

	const onShowLetterClick = () => {
		history.push(`/inbox/${letter.id}`);
		dispatch(
			pageActions.rememberScrollPosition({
				pageName: "inbox",
				scrollPosition: window.scrollY,
			})
		);
	};

	return (
		<LetterItemCard>
			<LetterPreview letter={letter} onClick={onShowLetterClick} />
		</LetterItemCard>
	);
};

export default InboxItem;
