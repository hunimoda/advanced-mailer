import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import TopHeader from "../../Components/New/TopHeader";
import Sheet from "../../Components/Sheet";
import InnerObject from "../../Components/Letter/InnerObject";
import ToolBox from "../../Components/New/ToolBox";
import classes from "./index.module.css";

const New = () => {
	const mainRef = useRef();
	const sheetRef = useRef();

	const aspectRatio = useSelector((state) => state.letter.sheet.aspectRatio);
	const sheetBgColor = useSelector(
		(state) => state.letter.sheet.backgroundColor
	);
	const sheetBgImage = useSelector(
		(state) => state.letter.sheet.backgroundImage
	);
	const objects = useSelector((state) => state.letter.objects);

	const [sheetSize, setSheetSize] = useState(null);
	const [selectedId, setSelectedId] = useState("temp");

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

			setSheetSize({ width: sheetWidth, height: sheetHeight });
		});

		const mainElem = mainRef.current;
		resizeObserver.observe(mainElem);

		return () => resizeObserver.unobserve(mainElem);
	}, [aspectRatio]);

	useEffect(
		() => window.addEventListener("touchstart", () => setSelectedId(null)),
		[]
	);

	const onSelectChange = (id, select) => setSelectedId(select ? id : null);

	return (
		<>
			<TopHeader />
			<main ref={mainRef} className={classes.main}>
				{sheetSize && (
					<Sheet
						ref={sheetRef}
						size={sheetSize}
						backgroundColor={sheetBgColor}
						backgroundImage={sheetBgImage}
					>
						{Object.entries(objects).map(([id, object]) => (
							<InnerObject
								key={id}
								id={id}
								sheetSize={sheetSize}
								onSelectChange={onSelectChange}
								selected={id === selectedId}
							/>
						))}
					</Sheet>
				)}
			</main>
			<ToolBox />
		</>
	);
};

export default New;
