import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { letterActions } from "../../Context/letter";
import TopHeader from "../../Components/New/TopHeader";
import Sheet from "../../Components/Sheet";
import InnerObject from "../../Components/Letter/InnerObject";
import ToolBox from "../../Components/New/ToolBox";
import classes from "./index.module.css";

const New = () => {
	const mainRef = useRef();

	const dispatch = useDispatch();

	const aspectRatio = useSelector((state) => state.letter.sheet.aspectRatio);
	const objects = useSelector((state) => state.letter.objects);

	const [selectedId, setSelectedId] = useState(null);

	useEffect(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			const mainEntry = entries[0];

			let width = null;
			let height = null;

			if (mainEntry.contentBoxSize) {
				const contentBoxSize = Array.isArray(mainEntry.contentBoxSize)
					? mainEntry.contentBoxSize[0]
					: mainEntry.contentBoxSize;

				width = contentBoxSize.inlineSize;
				height = contentBoxSize.blockSize;
			} else {
				const contentRect = mainEntry.contentRect;

				width = contentRect.width;
				height = contentRect.height;
			}

			const containerRatio = width / height;

			const sheetWidth =
				aspectRatio > containerRatio ? width : height * aspectRatio;
			const sheetHeight =
				aspectRatio > containerRatio ? width / aspectRatio : height;

			dispatch(
				letterActions.setSheetSize({ width: sheetWidth, height: sheetHeight })
			);
		});

		const mainElem = mainRef.current;
		resizeObserver.observe(mainElem);

		return () => resizeObserver.unobserve(mainElem);
	}, [dispatch, aspectRatio]);

	useEffect(
		() => window.addEventListener("touchstart", () => setSelectedId(null)),
		[]
	);

	const onSelectChange = (id, select) => setSelectedId(select ? id : null);

	return (
		<>
			<TopHeader />
			<main ref={mainRef} className={classes.main}>
				<Sheet>
					{Object.entries(objects).map(([id, object]) => (
						<InnerObject
							key={id}
							id={id}
							onSelectChange={onSelectChange}
							selected={id === selectedId}
						/>
					))}
				</Sheet>
			</main>
			<ToolBox />
		</>
	);
};

export default New;
