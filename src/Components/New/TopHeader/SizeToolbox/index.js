import { useEffect } from "react";
import SizeContainer from "./SizeContainer";
import Row from "../Row";

const COL_PER_ROW = 4;
const BRUSH_SIZES = [1, 1.5, 2, 2.5, 3, 4, 6, 8, 11, 14, 19, 28];

const SizeToolbox = ({ onSelect, size }) => {
	const numOfLines = Math.floor((BRUSH_SIZES.length - 1) / COL_PER_ROW) + 1;
	const rows = [];

	const onSelectSize = (event) =>
		onSelect(Number(event.currentTarget.dataset.label));

	useEffect(() => onSelect(BRUSH_SIZES[0]), [onSelect]);

	for (let rowIdx = 0; rowIdx < numOfLines; rowIdx++) {
		const containers = [];

		for (let colIdx = 0; colIdx < COL_PER_ROW; colIdx++) {
			const brushSize = BRUSH_SIZES[COL_PER_ROW * rowIdx + colIdx];

			if (brushSize) {
				containers.push(
					<SizeContainer
						key={`size-container_${rowIdx}-${colIdx}`}
						label={brushSize}
						onClick={onSelectSize}
						selected={brushSize === size}
					/>
				);
			}
		}

		rows.push(<Row key={`row_${rowIdx}`}>{containers}</Row>);
	}

	return <div>{rows}</div>;
};

export default SizeToolbox;
