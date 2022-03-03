import Toolbox from "../ToolBox";
import SizeToolbox from "../SizeToolbox";

const EraserToolbox = ({ show, onSelectEraser }) => {
	return (
		<Toolbox type="eraser" show={show}>
			<SizeToolbox onSelect={onSelectEraser} />
		</Toolbox>
	);
};

export default EraserToolbox;
