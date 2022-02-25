import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { pageActions } from "../../../Context/page";
import { uploadImageByDataUrl } from "../../../Firebase/storage";
import { sendLetter, saveLetterToDrafts } from "../../../Firebase/db";
import classes from "./index.module.css";

const generateLetterId = () => {
	let id = "";
	const PUSH_CHARS =
		"-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";

	for (let i = 0; i < 22; i++) {
		const randIdx = Math.floor(Math.random() * 64);

		id += PUSH_CHARS.charAt(randIdx);
	}

	return id;
};

const TopHeader = () => {
	const history = useHistory();

	const dispatch = useDispatch();
	const letter = useSelector((state) => state.letter);

	const onSaveLetterClick = async () => {
		const letterCopy = JSON.parse(JSON.stringify(letter));
		const letterId = generateLetterId();

		if (letterCopy.backgroundImage) {
			letterCopy.backgroundImage = await uploadImageByDataUrl(
				letterCopy.backgroundImage,
				letterId
			);
		}

		if (letterCopy.sheet.backgroundImage) {
			letterCopy.sheet.backgroundImage = await uploadImageByDataUrl(
				letterCopy.sheet.backgroundImage,
				letterId
			);
		}

		for (const id in letterCopy.objects) {
			const { type, value } = letterCopy.objects[id];
			console.log(letterCopy);

			if (type === "image" && value.startsWith("data:image/")) {
				letterCopy.objects[id].value = await uploadImageByDataUrl(
					value,
					letterId
				);
			}
		}

		saveLetterToDrafts(letterCopy, letterId).then(() => {
			history.replace("/drafts");
			dispatch(
				pageActions.setNeedsRefresh({ pageName: "drafts", needsRefresh: true })
			);
		});
	};

	const onSendLetterClick = async () => {
		const letterCopy = JSON.parse(JSON.stringify(letter));
		const letterId = generateLetterId();

		if (letterCopy.backgroundImage) {
			letterCopy.backgroundImage = await uploadImageByDataUrl(
				letterCopy.backgroundImage,
				letterId
			);
		}

		if (letterCopy.sheet.backgroundImage) {
			letterCopy.sheet.backgroundImage = await uploadImageByDataUrl(
				letterCopy.sheet.backgroundImage,
				letterId
			);
		}

		for (const id in letterCopy.objects) {
			const { type, value } = letterCopy.objects[id];
			console.log(letterCopy);

			if (type === "image" && value.startsWith("data:image/")) {
				letterCopy.objects[id].value = await uploadImageByDataUrl(
					value,
					letterId
				);
			}
		}

		sendLetter(letterCopy, letterId).then(() => {
			history.replace("/sent");
			dispatch(
				pageActions.setNeedsRefresh({ pageName: "sent", needsRefresh: true })
			);
		});
	};

	return (
		<header className={classes.header}>
			<button>
				<i className="fas fa-times" />
			</button>
			<div className={classes.controls}>
				<button onClick={onSaveLetterClick}>저장</button>
				<button onClick={onSendLetterClick}>완료</button>
			</div>
		</header>
	);
};

export default TopHeader;
