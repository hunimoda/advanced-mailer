import { useEffect, useState } from "react";
import Toolbox from "../ToolBox";
import SizeToolbox from "../SizeToolbox";

const EraserToolbox = ({ show }) => {
	const [size, setSize] = useState(null);

	useEffect(() => {
		if (size && show) {
			alert(`eraser size: ${size}`);
		}
	}, [size, show]);

	return (
		<Toolbox type="eraser" show={show}>
			<SizeToolbox onSelect={setSize} size={size} />
		</Toolbox>
	);
};

export default EraserToolbox;
