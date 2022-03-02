import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { letterActions } from "../../../Context/letter";
import { processStyle } from "./helper";
import store from "../../../Context";
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
	const [containerStyle, contentStyle, scale] = processStyle(
		forcedStyle ?? object.style,
		sheetSize
	);

	const [isAspectRatioFixed, setIsAspectRatioFixed] = useState(
		object.type === "image" ? true : false
	);
	const [showObjectSettings, setShowObjectSettings] = useState(false);
	const [showTextInput, setShowTextInput] = useState(false);
	const [pointerType, setPointerType] = useState(null);

	const MIN_SIDE_LENGTH = Math.max(
		(object.style.padding + object.style.border.width) * 2 * sheetSize.height,
		30
	);

	const moveObject = (left, top) =>
		dispatch(letterActions.moveObject({ id, left, top }));

	const objectRef = useRef();
	const getCenterPosition = () => {
		const { left: sheetLeft, top: sheetTop } =
			objectRef.current.parentElement.getBoundingClientRect();

		return {
			x: object.style.left * sheetSize.width + sheetLeft,
			y: object.style.top * sheetSize.height + sheetTop,
		};
	};

	const resizeObjectFixedAspectRatio = (x, y) => {
		const centerPosition = getCenterPosition();

		const diagonalVector = {
			x: x - centerPosition.x,
			y: y - centerPosition.y,
		};
		const diagonalLength = Math.sqrt(
			Math.pow(diagonalVector.x, 2) + Math.pow(diagonalVector.y, 2)
		);

		if (diagonalLength === 0) {
			return;
		}

		const diagonalAngle =
			(Math.sign(diagonalVector.y) || 1) *
			Math.acos(diagonalVector.x / diagonalLength);
		const objectAngle = Math.atan(
			(object.style.height * sheetSize.height) /
				(object.style.width * sheetSize.width)
		);

		const minDiagonalLength =
			MIN_SIDE_LENGTH /
			Math.cos(Math.max(objectAngle, Math.PI / 2 - objectAngle));

		const width =
			(Math.max(diagonalLength, minDiagonalLength) * Math.cos(objectAngle)) /
			sheetSize.width;
		const height =
			(Math.max(diagonalLength, minDiagonalLength) * Math.sin(objectAngle)) /
			sheetSize.height;

		const THRESHOLD_DEGREE = 1;
		const rotateDegree =
			(((diagonalAngle - objectAngle) * 180) / Math.PI + 360) % 360;

		dispatch(
			letterActions.resizeObjectFixedAspectRatio({
				id,
				width,
				height,
				angle:
					THRESHOLD_DEGREE < rotateDegree &&
					rotateDegree < 360 - THRESHOLD_DEGREE
						? rotateDegree
						: 0,
			})
		);
	};

	const resizeObjectSide = (x, y, side) => {
		const dotProduct = (vector1, vector2) =>
			vector1.x * vector2.x + vector1.y * vector2.y;

		const rotateAngle = (object.style.transform.rotate * Math.PI) / 180;
		const correctedAngle = rotateAngle + (side === "height" ? Math.PI / 2 : 0);
		const normalVector = {
			x: Math.cos(correctedAngle),
			y: Math.sin(correctedAngle),
		};

		const centerPosition = getCenterPosition();
		const lineConstant = -dotProduct(normalVector, centerPosition);

		const signedDistance = dotProduct(normalVector, { x, y }) + lineConstant;

		const referencePointAngle = rotateAngle + Math.PI / 4;
		const referencePoint = {
			x: centerPosition.x + Math.cos(referencePointAngle),
			y: centerPosition.y + Math.sin(referencePointAngle),
		};
		const realSign = Math.sign(
			dotProduct(normalVector, referencePoint) + lineConstant
		);

		if (Math.sign(signedDistance) === realSign) {
			let calculatedLengthPx = Math.max(
				MIN_SIDE_LENGTH,
				Math.abs(signedDistance)
			);
			const referenceLengthPx =
				side === "height"
					? object.style.width * sheetSize.width
					: object.style.height * sheetSize.height;

			if (Math.abs(calculatedLengthPx - referenceLengthPx) < 3) {
				calculatedLengthPx = referenceLengthPx;
			}

			dispatch(
				letterActions.resizeObjectSide({
					id,
					length:
						calculatedLengthPx /
						(side === "height" ? sheetSize.height : sheetSize.width),
					side,
				})
			);
		}
	};

	const deleteObject = () => {
		if (pointerType === "touch") {
			dispatch(letterActions.deleteObject(id));
			onSelectChange(id, false);
		}
	};

	const onLongTouch = () => {
		clickedAfterSelected = false;
		setShowObjectSettings(true);
	};

	const onObjectPointerDown = (event) => {
		setPointerType(event.pointerType);

		if (event.pointerType === "touch") {
			event.stopPropagation();
		}
	};

	const onObjectTouchStart = (event) => {
		if (readOnly || pointerType !== "touch") {
			return;
		}

		event.stopPropagation();
		timer = setTimeout(onLongTouch, TOUCH_DURATION);

		if (!selected) {
			onSelectChange(id, true);
			dispatch(letterActions.moveObjectToFront(id));
		} else {
			clickedAfterSelected = true;
		}

		prevCoord = { x: event.touches[0].clientX, y: event.touches[0].clientY };
	};

	const onTouchMove = (event) => {
		if (selected && pointerType === "touch") {
			clearTimeout(timer);
			clickedAfterSelected = false;

			const { clientX: x, clientY: y } = event.touches[0];
			const action = event.currentTarget.dataset.action;

			if (action === "move") {
				moveObject(
					(x - prevCoord.x) / sheetSize.width,
					(y - prevCoord.y) / sheetSize.height
				);
			} else if (action === "resize-fixed-ratio") {
				resizeObjectFixedAspectRatio(x, y);
			} else if (action === "resize-width") {
				resizeObjectSide(x, y, "width");
			} else if (action === "resize-height") {
				resizeObjectSide(x, y, "height");
			}

			prevCoord = { x, y };
		}
	};

	const onObjectTouchEnd = () => {
		if (clickedAfterSelected) {
			setIsAspectRatioFixed((prev) => !prev);
		}

		clearTimeout(timer);
		clickedAfterSelected = null;
		prevCoord = null;

		setPointerType(null);
	};

	const onSettingsClose = () => setShowObjectSettings(false);

	const borderRadiusInPixels =
		(object.style.borderRadius *
			Math.min(
				object.style.width * sheetSize.width,
				object.style.height * sheetSize.height
			)) /
		2 /
		scale;

	const getContentJsx = () => {
		if (object.type === "image") {
			return (
				<img
					className={classes.content}
					style={contentStyle}
					src={object.value}
					alt=""
				/>
			);
		} else if (object.type === "text") {
			return (
				<p className={classes.content} style={contentStyle}>
					{object.value}
				</p>
			);
		}

		return null;
	};

	const onShowTextInput = () => setShowTextInput(true);

	const onCancel = () => setShowTextInput(false);

	const onConfirm = (textValue) => {
		dispatch(letterActions.editText({ id, value: textValue }));
		setShowTextInput(false);
	};

	return (
		<>
			<div
				ref={objectRef}
				data-action="move"
				className={classes.object}
				style={containerStyle}
				onTouchStart={onObjectTouchStart}
				onTouchMove={onTouchMove}
				onTouchEnd={onObjectTouchEnd}
				onPointerDown={onObjectPointerDown}
			>
				{selected && (
					<Modifier
						onTouchMove={onTouchMove}
						isFixed={isAspectRatioFixed}
						onDelete={deleteObject}
						scale={scale}
						isAligned={!object.style.transform.rotate}
						isSquare={
							Math.abs(
								object.style.width * sheetSize.width -
									object.style.height * sheetSize.height
							) < 1
						}
						borderRadius={borderRadiusInPixels}
						onEdit={object.type === "text" && onShowTextInput}
					/>
				)}
				{getContentJsx()}
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
