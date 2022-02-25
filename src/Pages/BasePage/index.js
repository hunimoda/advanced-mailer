import { useState, useEffect } from "react";
import TitleBar from "../../Components/TitleBar";
import LetterList from "../../UI/LetterList";
import MoreLetters from "../../Components/MoreLetters";
import { useLetter } from "../../Hooks/useLetter";

const BasePage = ({ type, title, item: LetterItem }) => {
	const {
		isNewPending,
		isOldPending,
		hasNoMoreOlds,
		onGetNewLetters,
		onGetOldLetters,
		letters,
	} = useLetter(type);
	const [isInitialized, setIsInitialized] = useState(false);

	let oldStatus = null;

	if (isOldPending) {
		oldStatus = "pending";
	} else if (hasNoMoreOlds) {
		oldStatus = "none";
	}

	const newStatus = isNewPending ? "pending" : "";

	console.log(type);

	useEffect(() => {
		if (!isInitialized) {
			onGetOldLetters();
			setIsInitialized(true);
			console.log("onGetOldLetters");
		}
	}, [isInitialized, onGetOldLetters]);

	useEffect(() => {
		const onPageScroll = () => {
			const { innerHeight, scrollY } = window;
			const {
				body: { offsetHeight },
			} = document;

			const isScrolledToBottom = offsetHeight + 55 - innerHeight - scrollY <= 0;

			if (isScrolledToBottom && !isOldPending && !hasNoMoreOlds) {
				onGetOldLetters();
			}
		};

		window.addEventListener("scroll", onPageScroll);

		return () => window.removeEventListener("scroll", onPageScroll);
	}, [onGetOldLetters, hasNoMoreOlds, isOldPending]);

	return (
		<>
			<TitleBar onRefresh={onGetNewLetters} status={newStatus}>
				{title}
			</TitleBar>
			<LetterList>
				{letters.map((letter) => (
					<LetterItem key={letter.id} letter={letter} />
				))}
			</LetterList>
			<MoreLetters status={oldStatus} />
		</>
	);
};

export default BasePage;
