import { createPortal } from "react-dom";
import classes from "./index.module.css";

const Modal = ({ children, backdropColor, onClose }) => {
	return createPortal(
		<>
			<div
				className={classes.backdrop}
				style={{ backgroundColor: backdropColor ?? "rgba(0, 0, 0, 0.3)" }}
				onClick={onClose}
			/>
			<div className={classes.modal}>{children}</div>
		</>,
		document.getElementById("modal-root")
	);
};

export default Modal;
