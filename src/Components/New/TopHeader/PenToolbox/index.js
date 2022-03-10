import { useContext, useEffect, useState } from "react";
import Toolbox from "../ToolBox";
import SizeToolbox from "../SizeToolbox";
// import StyleToolbox from "../StyleToolbox";
import ColorToolbox from "../ColorToolbox";
import { CanvasContext } from "../../../../Context/canvas";

const PenToolbox = ({ show }) => {
	const { setPen } = useContext(CanvasContext);

	const [size, setSize] = useState(null);
	const [color, setColor] = useState(null);

	useEffect(() => {
		if (size && color && show) {
			setPen(size, color);
		}
	}, [size, color, show, setPen]);

	return (
		<Toolbox show={show}>
			<div>
				<SizeToolbox onSelect={setSize} size={size} />
				{/* <StyleToolbox onSelect={(style) => onSelectPen({ style })} /> */}
			</div>
			<ColorToolbox onSelect={setColor} color={color} />
		</Toolbox>
	);
};

export default PenToolbox;
