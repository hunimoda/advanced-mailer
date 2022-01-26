import LetterItemCard from "../../UI/LetterItemCard";
import classes from "./index.module.css";

const DraftItem = () => {
	return (
		<LetterItemCard className={classes.draftItem}>
			<div className={classes.draftItemRow}>
				<h4 className={classes.receiver}>김대훈</h4>
				<span className={classes.timestamp}>2022.01.26 18:02:33</span>
			</div>
			<p className={classes.message}>
				이것은 예시이며 편지의 간단한 설명 내지는 메시지 일부가 되겠습니다.
			</p>
		</LetterItemCard>
	);
};

export default DraftItem;
