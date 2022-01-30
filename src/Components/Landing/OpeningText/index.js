import { useEffect, useState } from "react";
import classes from "./index.module.css";

const OpeningText = ({ className, children }) => {
	const [isFloating, setIsFloating] = useState(false);

	useEffect(() => {
		setIsFloating(true);
		setTimeout(() => setIsFloating(false), 500);
	}, [children]);

	const openingClassName = `${classes.openingText} ${className}`;

	return (
		<div className={openingClassName}>
			<h1>Mailer</h1>
			<p className={isFloating ? classes.float : null}>{children}</p>
		</div>
	);
};

export default OpeningText;
