import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pageActions } from "../../Context/page";
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

	const dispatch = useDispatch();
	const scrollPosition = useSelector(
		(state) => state.page[type].scrollPosition
	);
	const needsRefresh = useSelector((state) => state.page[type].needsRefresh);

	const [isInitialized, setIsInitialized] = useState(false);

	let oldStatus = null;

	if (isOldPending) {
		oldStatus = "pending";
	} else if (hasNoMoreOlds) {
		oldStatus = "none";
	}

	const newStatus = isNewPending ? "pending" : "";

	useEffect(() => {
		if (needsRefresh) {
			onGetNewLetters();
			dispatch(pageActions.setNeedsRefresh(false));
		}
	}, [needsRefresh, dispatch, onGetNewLetters]);

	useEffect(() => {
		if (!isInitialized) {
			onGetOldLetters();
			setIsInitialized(true);
		}
	}, [isInitialized, onGetOldLetters]);

	useEffect(() => {
		if (scrollPosition !== null) {
			setTimeout(() => window.scrollTo(0, scrollPosition), 0);
			dispatch(pageActions.resetScrollPosition(type));
		}
	}, [scrollPosition, dispatch, type]);

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

		return () => {
			window.removeEventListener("scroll", onPageScroll);
		};
	}, [scrollPosition, onGetOldLetters, hasNoMoreOlds, isOldPending, type]);

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
