import { useState } from "react";
import LetterItemCard from "../../UI/LetterItemCard";
import LetterPreview from "../../UI/LetterPreview";
import classes from "./index.module.css";

const DUMMY_URL = "https://some-application-url/user-id/letter-id";

const SentItem = () => {
	const [showCopiedOK, setShowCopiedOK] = useState(false);

	const onCopyUrlClick = () => {
		if (window.isSecureContext) {
			navigator.clipboard.writeText(DUMMY_URL).then(
				() => {
					setShowCopiedOK(true);
					setTimeout(() => setShowCopiedOK(false), 2000);
				},
				() => {
					alert("Clipboard write failed");
				}
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
				<input type="url" value={DUMMY_URL} readOnly />
				<button className={copyBtnClassName} onClick={onCopyUrlClick}>
					<i className={copyIconClassName} />
				</button>
			</div>
			<LetterPreview />
		</LetterItemCard>
	);
};

export default SentItem;
