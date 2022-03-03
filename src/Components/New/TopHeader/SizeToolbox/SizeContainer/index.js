import Container from "../../Container";
import classes from "./index.module.css";

const SizeContainer = (props) => {
	return (
		<Container {...props} opaque={true}>
			<div
				style={{ width: props.label, height: props.label }}
				className={classes.brush}
			/>
		</Container>
	);
};

export default SizeContainer;
