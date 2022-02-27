import { useState } from "react";
import { useDispatch } from "react-redux";
import { letterActions } from "../../../../Context/letter";
import classes from "./index.module.css";

const SheetAspectRatio = ({ onRatioChange }) => {
	const dispatch = useDispatch();
	const [isVertical, setIsVertical] = useState(true);

	const listClassName =
		classes.ratioList + (!isVertical ? " " + classes.rotated : "");
	const buttonsClassName =
		classes.sheetOrientation + (!isVertical ? " " + classes.horizontal : "");

	const onSelectRatio = (event) => {
		const width = Number(event.currentTarget.dataset.width);
		const height = Number(event.currentTarget.dataset.height);

		dispatch(
			letterActions.resizeSheet(isVertical ? width / height : height / width)
		);
		onRatioChange(isVertical ? `${width}:${height}` : `${height}:${width}`);
	};

	return (
		<>
			<div className={buttonsClassName}>
				<button onClick={() => setIsVertical(false)}>
					<i className="far fa-sticky-note" />
				</button>
				<button onClick={() => setIsVertical(true)}>
					<i className="far fa-sticky-note" />
				</button>
			</div>
			<ul className={listClassName}>
				<li>
					<div onClick={onSelectRatio} data-width="9" data-height="16">
						<span>{isVertical ? "9:16" : "16:9"}</span>
					</div>
				</li>
				<li>
					<div onClick={onSelectRatio} data-width="3" data-height="4">
						<span>{isVertical ? "3:4" : "4:3"}</span>
					</div>
				</li>
				<li>
					<div onClick={onSelectRatio} data-width="1" data-height="1">
						<span>1:1</span>
					</div>
				</li>
			</ul>
		</>
	);
};

export default SheetAspectRatio;
