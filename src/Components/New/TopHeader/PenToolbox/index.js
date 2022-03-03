import Toolbox from "../ToolBox";
import SizeToolbox from "../SizeToolbox";
import StyleToolbox from "../StyleToolbox";
import ColorToolbox from "../ColorToolbox";

const PenToolbox = ({ show, onSelectPen }) => {
	return (
		<Toolbox show={show}>
			<div>
				<SizeToolbox onSelect={(size) => onSelectPen({ size })} />
				<StyleToolbox onSelect={(style) => onSelectPen({ style })} />
			</div>
			<ColorToolbox onSelect={(color) => onSelectPen({ color })} />
		</Toolbox>
	);
};

export default PenToolbox;
