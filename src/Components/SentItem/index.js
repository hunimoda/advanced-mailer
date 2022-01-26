import LetterItemCard from "../../UI/LetterItemCard";
import LetterPreview from "../../UI/LetterPreview";
import classes from "./index.module.css";

const SentItem = () => {
	return (
		<LetterItemCard>
			<div className={classes.letterURL}>
				<input
					type="url"
					value="https://some-application-url/user-id/letter-id"
					readOnly
				/>
				<button className={classes.copyBtn}>
					<i className="far fa-copy" />
				</button>
			</div>
			<LetterPreview />
		</LetterItemCard>
	);
};

export default SentItem;
