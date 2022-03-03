import Container from "../../Container";
import classes from "./index.module.css";

const ColorContainer = (props) => {
	return (
		<Container {...props}>
			<div className={classes.color} style={{ backgroundColor: props.label }} />
		</Container>
	);
};

export default ColorContainer;
