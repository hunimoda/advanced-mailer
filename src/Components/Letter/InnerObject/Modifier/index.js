import { useDispatch } from "react-redux";
import { letterActions } from "../../../../Context/letter";
import { getBorderRadius, isAligned, isSquare, getScale } from "../helper";
import classes from "./index.module.css";

const Modifier = ({ id, onEdit, isFixed }) => {
	const dispatch = useDispatch();
	const scale = getScale(id);

	const borderClass = `${classes.border} ${
		isAligned(id) ? classes["border--aligned"] : ""
	}`;
	const borderStyle = {
		borderWidth: `${1 / scale}px`,
		transform: `translate(-${1 / scale}px, -${1 / scale}px)`,
		borderRadius: `${getBorderRadius(id)}px`,
	};

	const scaleAndTranslate = {
		transform: `scale(${1 / scale}) translate(-50%, -50%)`,
	};

	const onDelete = () => dispatch(letterActions.deleteObject(id));

	const deleteButton = (
		<button
			className={classes.delete}
			style={scaleAndTranslate}
			onClick={onDelete}
		>
			<i className="fas fa-times" />
		</button>
	);

	const editButton = (
		<button
			className={classes.edit}
			style={{
				transform: `scale(${1 / scale}) translate(0, -100%)`,
			}}
			onClick={onEdit}
		>
			<i className="fas fa-edit" />
		</button>
	);

	const squareIndicators = (
		<>
			<div className={classes.topIndicator} style={scaleAndTranslate} />
			<div className={classes.leftIndicator} style={scaleAndTranslate} />
		</>
	);

	const fixedRatioResizeButton = (
		<span
			data-type="fixed-resize-button"
			className={classes.resize}
			style={scaleAndTranslate}
		>
			<i className="fas fa-arrows-alt-h" />
		</span>
	);

	const variableRatioResizeButtons = (
		<>
			<button
				data-type="resize-width-button"
				className={classes.resizeWidthBtn}
				style={scaleAndTranslate}
			>
				<i className="fas fa-arrows-alt-h" />
			</button>
			<button
				data-type="resize-height-button"
				className={classes.resizeHeightBtn}
				style={scaleAndTranslate}
			>
				<i className="fas fa-arrows-alt-v" />
			</button>
		</>
	);

	return (
		<>
			<div className={borderClass} style={borderStyle} />
			{deleteButton}
			{onEdit && editButton}
			{isSquare(id) && squareIndicators}
			{isFixed ? fixedRatioResizeButton : variableRatioResizeButtons}
		</>
	);
};

export default Modifier;
