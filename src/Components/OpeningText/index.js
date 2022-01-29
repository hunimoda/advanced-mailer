import classes from "./index.module.css";

const OpeningText = ({ className, children }) => {
	const openingClassName = `${classes.openingText} ${className}`;

	return (
		<div className={openingClassName}>
			<h1>Mailer</h1>
			<p>{children}</p>
		</div>
	);
};

export default OpeningText;
