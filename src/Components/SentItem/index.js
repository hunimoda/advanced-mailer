import { useState } from "react";
import { useHistory } from "react-router-dom";
import { getMyUid } from "../../Firebase/auth";
import LetterItemCard from "../../UI/LetterItemCard";
import LetterPreview from "../../UI/LetterPreview";
import classes from "./index.module.css";

const SentItem = ({ id, metaData }) => {
	const [showCopiedOK, setShowCopiedOK] = useState(false);

	const history = useHistory();

	const { protocol, hostname } = window.location;
	const letterPath = `/view?id=${id}&uid=${getMyUid()}`;
	const letterUrl = `${protocol}//${hostname}${letterPath}`;

	const onShowLetterClick = () => history.push(letterPath);

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
			<LetterPreview metaData={metaData} onClick={onShowLetterClick} />
		</LetterItemCard>
	);
};

export default SentItem;
