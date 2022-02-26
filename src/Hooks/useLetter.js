import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	getLettersBeforeTimestamp,
	getLettersAfterTimestamp,
} from "../Firebase/db";
import { pageActions } from "../Context/page";

export const useLetter = (pageName) => {
	const [isNewPending, setIsNewPending] = useState(false);
	const [isOldPending, setIsOldPending] = useState(false);

	const dispatch = useDispatch();
	const page = useSelector((state) => state.page[pageName]);
	const {
		timestamp: { start, end },
		letters,
	} = page;

	const onGetNewLetters = useCallback(async () => {
		if (end === null) {
			return;
		}

		setIsNewPending(true);

		const letters = await getLettersAfterTimestamp(pageName, end);

		if (letters.length > 0) {
			dispatch(pageActions.prepend({ pageName, letters }));
			dispatch(
				pageActions.setTimestamp({
					pageName,
					timestamp: { start, end: letters[0].metaData.createdAt },
				})
			);
		}

		setIsNewPending(false);
	}, [dispatch, start, end, pageName]);

	const onGetOldLetters = useCallback(async () => {
		if (start < 0) {
			return;
		}

		setIsOldPending(true);

		const LIMIT_COUNT = 3;
		const refTimestamp = start ?? Date.now();
		const letters = await getLettersBeforeTimestamp(
			pageName,
			refTimestamp,
			LIMIT_COUNT
		);
		let startTimestamp = null;

		if (letters.length > 0) {
			startTimestamp = letters[letters.length - 1].metaData.createdAt;
			dispatch(pageActions.append({ pageName, letters }));
		}

		if (letters.length < LIMIT_COUNT) {
			startTimestamp = -1;
		}

		dispatch(
			pageActions.setTimestamp({
				pageName,
				timestamp: { start: startTimestamp, end: end ?? refTimestamp },
			})
		);

		setIsOldPending(false);
	}, [dispatch, start, end, pageName]);

	return {
		isNewPending,
		isOldPending,
		hasNoMoreOlds: Number.isInteger(start) && start <= 0,
		onGetNewLetters,
		onGetOldLetters,
		letters,
	};
};
