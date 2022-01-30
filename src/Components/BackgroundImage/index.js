import classes from "./index.module.css";

const BackgroundImage = ({ url, className }) => {
	const bgImageClassName = `${classes.backgroundImage} ${className}`;

	return (
		<div
			className={bgImageClassName}
			style={{ backgroundImage: `url(${url})` }}
		/>
	);
};

export default BackgroundImage;
