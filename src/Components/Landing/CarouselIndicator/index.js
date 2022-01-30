import classes from "./index.module.css";

const CarouselIndicator = ({ length, index }) => {
	const indicators = [];

	for (let i = 0; i < length; i++) {
		indicators.push(
			<li key={i} className={i === index ? classes.active : null} />
		);
	}

	return <ol className={classes.indicators}>{indicators}</ol>;
};

export default CarouselIndicator;
