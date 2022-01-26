import LetterItemCard from "../../UI/LetterItemCard";
import LetterPreview from "../../UI/LetterPreview";
import classes from "./index.module.css";

const SentItem = () => {
	return (
		<LetterItemCard>
			<div className={classes.row}>
				<input
					type="url"
					value="https://some-application-url/user-id/letter-id"
					readOnly
				/>
				<i className="far fa-copy" />
			</div>
			<LetterPreview />
		</LetterItemCard>
	);
};

export default SentItem;
