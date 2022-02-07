import LetterItemCard from "../../UI/LetterItemCard";
import classes from "./index.module.css";

const DraftItem = ({ id, metaData }) => {
	return (
		<LetterItemCard className={classes.draftItem}>
			<div className={classes.draftItemRow}>
				<h4 className={classes.receiver}>김대훈</h4>
				<span className={classes.timestamp}>{metaData.createdAt}</span>
			</div>
			<p className={classes.message}>{metaData.summary}</p>
		</LetterItemCard>
	);
};

export default DraftItem;
