import Toolbox from "../ToolBox";
import SizeToolbox from "../SizeToolbox";

const EraserToolbox = ({ show }) => {
	return (
		<Toolbox type="eraser" show={show}>
			<SizeToolbox onSelect />
		</Toolbox>
	);
};

export default EraserToolbox;
