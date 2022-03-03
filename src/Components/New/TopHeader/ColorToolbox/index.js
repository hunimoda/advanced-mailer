import { useState } from "react";
import Row from "../Row";
import ColorContainer from "./ColorContainer";
import classes from "./index.module.css";

const COL_PER_ROW = 4;
const BRUSH_COLORS = [
	"#ffff01",
	"#fa9d00",
	"#ed3624",
	"#fe00d4",
	"#a9ff18",
	"#60ba46",
	"#a400c8",
	"#612d91",
	"#00733a",
	"#006fff",
	"#1649b2",
	"#120376",
	"#ffffff",
	"#969696",
	"#000000",
	"#946635",
];

const ColorToolbox = ({ onSelect }) => {
	const [selectedBrushColor, setSelectedBrushColor] = useState(
		BRUSH_COLORS[14]
	);

	const numOfLines = Math.floor((BRUSH_COLORS.length - 1) / COL_PER_ROW) + 1;
	const rows = [];

	const onSelectColor = (event) => {
		const brushColor = event.currentTarget.dataset.label;

		setSelectedBrushColor(brushColor);
		onSelect(brushColor);
	};

	for (let rowIdx = 0; rowIdx < numOfLines; rowIdx++) {
		const containers = [];

		for (let colIdx = 0; colIdx < COL_PER_ROW; colIdx++) {
			const brushColor = BRUSH_COLORS[COL_PER_ROW * rowIdx + colIdx];

			if (brushColor) {
				containers.push(
					<ColorContainer
						key={`size-container_${rowIdx}-${colIdx}`}
						label={brushColor}
						onClick={onSelectColor}
						selected={brushColor === selectedBrushColor}
					/>
				);
			}
		}

		rows.push(<Row key={`row_${rowIdx}`}>{containers}</Row>);
	}

	return <div className={classes.colors}>{rows}</div>;
};

export default ColorToolbox;
