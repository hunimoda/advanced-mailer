import Toolbox from "../ToolBox";
import SizeToolbox from "../SizeToolbox";
import StyleToolbox from "../StyleToolbox";
import ColorToolbox from "../ColorToolbox";

const PenToolbox = ({ show, context, minBrushWidth }) => {
	return (
		<Toolbox show={show}>
			<div>
				<SizeToolbox onSelect />
				<StyleToolbox onSelect />
			</div>
			<ColorToolbox
				onSelect={(color) => {
					context.strokeStyle = color;
					context.shadowColor = color;
				}}
			/>
		</Toolbox>
	);
};

export default PenToolbox;
