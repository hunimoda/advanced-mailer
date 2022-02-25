import LetterItemCard from "../../UI/LetterItemCard";
import classes from "./index.module.css";

const getSummaryFromLetterObjects = (objects) => {
	const CUT_LENGTH = 50;
	let summary = "";

	for (const id of Object.keys(objects).sort()) {
		if (objects[id].type === "text") {
			summary += ` ${objects[id].value}`;
		}
	}

	summary = summary.replace(/\s+/g, " ").trim();

	if (summary.length > CUT_LENGTH) {
		summary = summary.slice(0, CUT_LENGTH).trim() + "...";
	}

	return summary;
};

const DraftItem = ({ letter: { letter, metaData } }) => {
	const summary = getSummaryFromLetterObjects(letter.objects);

	const createdAtFormatted = new Date(metaData.createdAt)
		.toISOString()
		.substr(0, 19)
		.replace("T", " ");

	return (
		<LetterItemCard className={classes.draftItem}>
			<p className={classes.timestamp}>{createdAtFormatted}</p>
			<p className={classes.message}>{summary || "(내용 없음)"}</p>
		</LetterItemCard>
	);
};

export default DraftItem;
