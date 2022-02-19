import { createPortal } from "react-dom";
import classes from "./index.module.css";

const Modal = ({ className, children, backdropColor, onClose }) => {
	const onBackdropTouch = (event) => {
		event.stopPropagation();
		onClose();
	};

	return createPortal(
		<>
			<div
				className={classes.backdrop}
				style={{ backgroundColor: backdropColor ?? "rgba(0, 0, 0, 0.3)" }}
				onTouchStart={onBackdropTouch}
			/>
			<div
				className={`${classes.modal} ${className}`}
				onTouchStart={(event) => event.stopPropagation()}
			>
				{children}
			</div>
		</>,
		document.getElementById("modal-root")
	);
};

export default Modal;
