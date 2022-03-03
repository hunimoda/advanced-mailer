import { useState } from "react";
import SizeContainer from "./SizeContainer";
import Row from "../Row";

const COL_PER_ROW = 4;
const BRUSH_SIZES = [1, 1.5, 2, 2.5, 3, 4, 6, 8, 11, 14, 19, 28];

const SizeToolbox = () => {
	const [selectedLabel, setSelectedLabel] = useState(3);

	const numOfLines = Math.floor((BRUSH_SIZES.length - 1) / COL_PER_ROW) + 1;
	const rows = [];

	const onSelect = (event) =>
		setSelectedLabel(Number(event.currentTarget.dataset.label));

	for (let rowIdx = 0; rowIdx < numOfLines; rowIdx++) {
		const containers = [];

		for (let colIdx = 0; colIdx < COL_PER_ROW; colIdx++) {
			const label = BRUSH_SIZES[COL_PER_ROW * rowIdx + colIdx];

			if (label) {
				containers.push(
					<SizeContainer
						key={`size-container_${rowIdx}-${colIdx}`}
						label={BRUSH_SIZES[COL_PER_ROW * rowIdx + colIdx]}
						onClick={onSelect}
						selected={label === selectedLabel}
					/>
				);
			}
		}

		rows.push(<Row key={`row_${rowIdx}`}>{containers}</Row>);
	}

	return <div>{rows}</div>;
};

export default SizeToolbox;
