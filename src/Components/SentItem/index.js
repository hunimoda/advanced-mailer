import { useState } from "react";
import { useHistory } from "react-router-dom";
import LetterItemCard from "../../UI/LetterItemCard";
import LetterPreview from "../../UI/LetterPreview";
import classes from "./index.module.css";

const DUMMY_URL = "https://some-application-url/user-id/letter-id";

const SentItem = ({ id, description }) => {
	const [showCopiedOK, setShowCopiedOK] = useState(false);

	const history = useHistory();

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

	const onShowLetterClick = () => history.push(`/${id}`);

	const copyBtnClassName = `${classes.copyBtn} ${
		showCopiedOK ? classes["copyBtn--highlight"] : ""
	}`;
	const copyIconClassName = showCopiedOK
		? `fas fa-check ${classes.check}`
		: "far fa-copy";

	return (
		<LetterItemCard onClick={onShowLetterClick}>
			<div className={classes.letterURL}>
				<input type="url" value={DUMMY_URL} readOnly />
				<button className={copyBtnClassName} onClick={onCopyUrlClick}>
					<i className={copyIconClassName} />
				</button>
			</div>
			<LetterPreview description={description} />
		</LetterItemCard>
	);
};

export default SentItem;
