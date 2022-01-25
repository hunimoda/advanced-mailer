import { useState, useEffect } from "react";
import classes from "./index.module.css";

const Backdrop = ({ isActive }) => {
	const [isVisible, setIsVisible] = useState(false);
	const [backdropClass, setBackdropClass] = useState(classes.backdrop);

	useEffect(() => {
		if (isActive) {
			setIsVisible(true);
			setTimeout(() => {
				setBackdropClass(`${classes.backdrop} ${classes["backdrop--active"]}`);
			}, 50);
		} else {
			setBackdropClass(classes.backdrop);
			setTimeout(() => {
				setIsVisible(false);
			}, 500);
		}
	}, [isActive]);

	if (isActive || isVisible) {
		return <div className={backdropClass} />;
	}

	return null;
};

export default Backdrop;
