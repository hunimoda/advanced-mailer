import Toolbox from "../ToolBox";
import SizeToolbox from "../SizeToolbox";
import StyleToolbox from "../StyleToolbox";
import ColorToolbox from "../ColorToolbox";

const PenToolbox = ({ show }) => {
	return (
		<Toolbox show={show}>
			<div>
				<SizeToolbox onSelect />
				<StyleToolbox onSelect />
			</div>
			<ColorToolbox />
		</Toolbox>
	);
};

export default PenToolbox;
