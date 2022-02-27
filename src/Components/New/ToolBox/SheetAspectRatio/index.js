import { useState } from "react";
import classes from "./index.module.css";

const SheetAspectRatio = () => {
	const [isVertical, setIsVertical] = useState(true);

	const listClassName =
		classes.ratioList + (!isVertical ? " " + classes.rotated : "");
	const buttonsClassName =
		classes.sheetOrientation + (!isVertical ? " " + classes.horizontal : "");

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
					<div>
						<span>{isVertical ? "9:16" : "16:9"}</span>
					</div>
				</li>
				<li>
					<div>
						<span>{isVertical ? "3:4" : "4:3"}</span>
					</div>
				</li>
				<li>
					<div>
						<span>1:1</span>
					</div>
				</li>
			</ul>
		</>
	);
};

export default SheetAspectRatio;
