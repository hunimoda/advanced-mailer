import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { pageActions } from "../../Context/page";
import LetterItemCard from "../../UI/LetterItemCard";
import LetterPreview from "../../UI/LetterPreview";
import classes from "./index.module.css";

const SentItem = ({ letterDoc }) => {
	const { id, letter, metaData } = letterDoc;

	const dispatch = useDispatch();
	const history = useHistory();
	const [showCopiedOK, setShowCopiedOK] = useState(false);

	const { protocol, hostname } = window.location;
	const letterPath = `/view?id=${id}&uid=${metaData.writerUid}`;
	const letterUrl = `${protocol}//${hostname}${letterPath}`;

	const onShowLetterClick = () => {
		history.push(`/sent/${id}`);
		dispatch(
			pageActions.rememberScrollPosition({
				pageName: "sent",
				scrollPosition: window.scrollY,
			})
		);
	};

	const onCopyUrlClick = () => {
		if (window.isSecureContext) {
			navigator.clipboard.writeText(letterUrl).then(
				() => {
					setShowCopiedOK(true);
					setTimeout(() => setShowCopiedOK(false), 2000);
				},
				() => alert("Clipboard write failed")
			);
		} else {
			alert("window.isSecureContext === false");
		}
	};

	const copyBtnClassName = `${classes.copyBtn} ${
		showCopiedOK ? classes["copyBtn--highlight"] : ""
	}`;
	const copyIconClassName = showCopiedOK
		? `fas fa-check ${classes.check}`
		: "far fa-copy";

	return (
		<LetterItemCard>
			<div className={classes.letterURL}>
				<input type="url" value={letterUrl} readOnly />
				<button className={copyBtnClassName} onClick={onCopyUrlClick}>
					<i className={copyIconClassName} />
				</button>
			</div>
			<LetterPreview letterDoc={letterDoc} onClick={onShowLetterClick} />
		</LetterItemCard>
	);
};

export default SentItem;
