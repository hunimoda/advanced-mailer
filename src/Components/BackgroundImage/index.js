import classes from "./index.module.css";

const BackgroundImage = ({ url }) => {
	return (
		<div
			className={classes.backgroundImage}
			style={{ backgroundImage: `url(${url})` }}
		/>
	);
};

export default BackgroundImage;
