import Container from "../Container";
import Row from "../Row";
import classes from "./index.module.css";

const ColorToolbox = () => {
	return (
		<div className={classes.colors}>
			<Row>
				<Container />
				<Container />
				<Container />
				<Container />
			</Row>
			<Row>
				<Container />
				<Container />
				<Container />
				<Container />
			</Row>
			<Row>
				<Container />
				<Container />
				<Container />
				<Container />
			</Row>
			<Row>
				<Container />
				<Container />
				<Container />
				<Container />
			</Row>
		</div>
	);
};

export default ColorToolbox;
