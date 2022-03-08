import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { letterActions } from "../../../Context/letter";
import {
	processStyle,
	moveObject,
	resizeObjectFixedAspectRatio,
	resizeObjectSide,
	getContentJsx,
	getObjectSize,
} from "./helper";
import Modifier from "./Modifier";
import ObjectSettings from "./ObjectSettings";
import TextInput from "../../New/TextInput";
import classes from "./index.module.css";

let prevCoord = null;
let clickedAfterSelected = null;
let timer = null;
const TOUCH_DURATION = 500;

const InnerObject = ({ id, onSelect, selected, forcedStyle }) => {
	const dispatch = useDispatch();
	const { type, value, style } = useSelector(
		(state) => state.letter.objects[id]
	);

	const objectRef = useRef();

	const [isAspectRatioFixed, setIsAspectRatioFixed] = useState(
		type === "image" ? true : false
	);
	const [showObjectSettings, setShowObjectSettings] = useState(false);
	const [showTextInput, setShowTextInput] = useState(false);

	const { containerStyle, contentStyle } = processStyle(forcedStyle ?? style);
	const readOnly = !Boolean(onSelect);

	const getCenterPosition = () => {
		const { left: sheetLeft, top: sheetTop } =
			objectRef.current.parentElement.getBoundingClientRect();
		const objectSize = getObjectSize(id);

		return {
			x: objectSize.x + sheetLeft,
			y: objectSize.y + sheetTop,
		};
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
					onSelect(id);
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

				const xChange = touchPosition.x - prevCoord.x;
				const yChange = touchPosition.y - prevCoord.y;

				moveObject(id, xChange, yChange);
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

	const onEdit = type === "text" && (() => setShowTextInput(true));

	const onTextInputClose = () => setShowTextInput(false);

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
					<Modifier id={id} onEdit={onEdit} isFixed={isAspectRatioFixed} />
				)}
				{getContentJsx(type, value, contentStyle)}
			</div>
			{showObjectSettings && (
				<ObjectSettings id={id} onClose={onSettingsClose} />
			)}
			{showTextInput && <TextInput id={id} onClose={onTextInputClose} />}
		</>
	);
};

export default InnerObject;
