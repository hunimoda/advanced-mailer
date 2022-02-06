import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSentLettersBeforeTimestamp } from "../Firebase/db";
import { pageActions } from "../Context/page";

export const useLetter = () => {
	const [isNewPending, setIsNewPending] = useState(false);
	const [isOldPending, setIsOldPending] = useState(false);

	const dispatch = useDispatch();
	const sent = useSelector((state) => state.page.sent);
	const {
		timestamp: { start, end },
		letters,
	} = sent;

	const onGetNewLetters = () => {};

	const onGetOldLetters = async () => {
		if (start < 0) {
			return;
		}

		setIsOldPending(true);

		const refTimestamp = start ?? Date.now();
		const letters = await getSentLettersBeforeTimestamp(refTimestamp, 1);
		let startTimestamp = null;

		if (letters.length > 0) {
			startTimestamp = letters[letters.length - 1].metaData.createdAt;
			dispatch(pageActions.append({ pageName: "sent", letters }));
		} else {
			startTimestamp = -1;
		}

		dispatch(
			pageActions.setTimestamp({
				pageName: "sent",
				timestamp: { start: startTimestamp, end: refTimestamp },
			})
		);

		setIsOldPending(false);
	};

	return {
		isNewPending,
		isOldPending,
		hasNoMoreOlds: Number.isInteger(start) && start <= 0,
		onGetNewLetters,
		onGetOldLetters,
		letters,
	};
};
