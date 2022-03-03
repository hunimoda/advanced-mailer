import { useState } from "react";
import Container from "../Container";
import Row from "../Row";
import classes from "./index.module.css";

const BRUSH_STYLES = ["constant", "varying"];

const StyleToolbox = ({ onSelect }) => {
	const [brushStyle, setBrushStyle] = useState(BRUSH_STYLES[0]);

	const onSelectStyle = (event) => {
		const style = event.currentTarget.dataset.label;

		setBrushStyle(style);
		onSelect(style);
	};

	return (
		<div>
			<Row>
				{BRUSH_STYLES.map((style) => (
					<Container
						key={style}
						type="long"
						label={style}
						onClick={onSelectStyle}
						selected={style === brushStyle}
					>
						<img
							src={`/${style}-width.png`}
							alt=""
							className={classes.brushStyleImage}
						/>
					</Container>
				))}
			</Row>
		</div>
	);
};

export default StyleToolbox;
