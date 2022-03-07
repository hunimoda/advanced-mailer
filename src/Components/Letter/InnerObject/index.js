import { useState, useRef } from "react";
import { letterActions } from "../../../Context/letter";
import {
	processStyle,
	moveObject,
	resizeObjectFixedAspectRatio,
	resizeObjectSide,
	getContentJsx,
	isSquare,
	getBorderRadius,
	isAligned,
} from "./helper";
import Modifier from "./Modifier";
import ObjectSettings from "./ObjectSettings";
import TextInput from "../../New/TextInput";
import classes from "./index.module.css";

let prevCoord = null;
let clickedAfterSelected = null;
let timer = null;
const TOUCH_DURATION = 1000;

const InnerObject = ({
	id,
	onSelectChange,
	selected,
	forcedStyle,
	readOnly,
	dispatch,
	sheetSize,
	object,
}) => {
	const { containerStyle, contentStyle, scale } = processStyle(
		forcedStyle ?? object.style
	);

	const [isAspectRatioFixed, setIsAspectRatioFixed] = useState(
		object.type === "image" ? true : false
	);
	const [showObjectSettings, setShowObjectSettings] = useState(false);
	const [showTextInput, setShowTextInput] = useState(false);

	const objectRef = useRef();
	const getCenterPosition = () => {
		const { left: sheetLeft, top: sheetTop } =
			objectRef.current.parentElement.getBoundingClientRect();

		return {
			x: object.style.left * sheetSize.width + sheetLeft,
			y: object.style.top * sheetSize.height + sheetTop,
		};
	};

	const onDelete = () => {
		dispatch(letterActions.deleteObject(id));
		onSelectChange(id, false);
	};

	const onLongTouch = () => {
		clickedAfterSelected = false;
		setShowObjectSettings(true);
	};

	const onPointerDown = (event) => {
		if (!readOnly && event.pointerType === "touch") {
			event.stopPropagation();

			if (event.target.dataset.type === "content") {
				if (selected) {
					clearTimeout(timer);
					timer = setTimeout(onLongTouch, TOUCH_DURATION);

					clickedAfterSelected = true;
				} else {
					onSelectChange(id, true);
					dispatch(letterActions.moveObjectToFront(id));
				}

				prevCoord = {
					x: event.clientX,
					y: event.clientY,
				};
			}
		}
	};

	const onPointerMove = (event) => {
		if (!readOnly && event.pointerType === "touch") {
			const targetType = event.target.dataset.type;
			const touchPosition = {
				x: event.clientX,
				y: event.clientY,
			};
			const centerPosition = getCenterPosition();

			if (targetType === "content") {
				clearTimeout(timer);
				clickedAfterSelected = false;

				moveObject(
					id,
					(touchPosition.x - prevCoord.x) / sheetSize.width,
					(touchPosition.y - prevCoord.y) / sheetSize.height
				);
			} else if (targetType === "fixed-resize-button") {
				resizeObjectFixedAspectRatio(id, centerPosition, touchPosition);
			} else if (targetType === "resize-width-button") {
				resizeObjectSide(id, centerPosition, touchPosition, "width");
			} else if (targetType === "resize-height-button") {
				resizeObjectSide(id, centerPosition, touchPosition, "height");
			}

			prevCoord = touchPosition;
		}
	};

	const onPointerUp = (event) => {
		if (!readOnly && event.pointerType === "touch") {
			if (event.target.dataset.type === "content") {
				if (clickedAfterSelected) {
					setIsAspectRatioFixed((prev) => !prev);
				}

				clearTimeout(timer);
				clickedAfterSelected = null;
				prevCoord = null;
			}
		}
	};

	const onSettingsClose = () => setShowObjectSettings(false);

	const onEdit = object.type === "text" && (() => setShowTextInput(true));

	const onCancel = () => setShowTextInput(false);

	const onConfirm = (textValue) => {
		dispatch(letterActions.editText({ id, value: textValue }));
		setShowTextInput(false);
	};

	return (
		<>
			<div
				ref={objectRef}
				className={classes.object}
				style={containerStyle}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
			>
				{selected && (
					<Modifier
						isFixed={isAspectRatioFixed}
						scale={scale}
						id={id}
						onEdit={onEdit}
						onDelete={onDelete}
					/>
				)}
				{getContentJsx(object.type, object.value, contentStyle)}
			</div>
			{showObjectSettings && (
				<ObjectSettings
					id={id}
					onClose={onSettingsClose}
					style={object.style}
				/>
			)}
			{showTextInput && (
				<TextInput
					defaultValue={object.value}
					onCancel={onCancel}
					onConfirm={onConfirm}
				/>
			)}
		</>
	);
};

export default InnerObject;
