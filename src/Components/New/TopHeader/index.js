import { useSelector } from "react-redux";
import { uploadImageByDataUrl } from "../../../Firebase/storage";
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
	const letter = useSelector((state) => state.letter);

	const onSaveLetterClick = () => {};

	const onSendLetterClick = async () => {
		const letterCopy = JSON.parse(JSON.stringify(letter));
		const letterId = generateLetterId();

		for (const id in letterCopy.objects) {
			const { type, value } = letterCopy.objects[id];

			if (type === "image" && value.startsWith("data:image/")) {
				letterCopy.objects[id].value = await uploadImageByDataUrl(
					value,
					letterId
				);
			}
		}

		console.log(letterCopy);
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
