import { useState, useRef } from "react";
import { letterActions } from "../../../Context/letter";
import { processStyle } from "./helper";
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
			const { clientX: x, clientY: y } = event;

			if (targetType === "content") {
				clearTimeout(timer);
				clickedAfterSelected = false;

				moveObject(
					(x - prevCoord.x) / sheetSize.width,
					(y - prevCoord.y) / sheetSize.height
				);
			} else if (targetType === "fixed-resize-button") {
				resizeObjectFixedAspectRatio(x, y);
			} else if (targetType === "resize-width-button") {
				resizeObjectSide(x, y, "width");
			} else if (targetType === "resize-height-button") {
				resizeObjectSide(x, y, "height");
			}

			prevCoord = { x, y };
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
					data-type="content"
					className={classes.content}
					style={contentStyle}
					src={object.value}
					alt=""
				/>
			);
		} else if (object.type === "text") {
			return (
				<p className={classes.content} style={contentStyle} data-type="content">
					{object.value}
				</p>
			);
		}

		return null;
	};

	const onEdit = object.type === "text" && (() => setShowTextInput(true));

	const onCancel = () => setShowTextInput(false);

	const onConfirm = (textValue) => {
		dispatch(letterActions.editText({ id, value: textValue }));
		setShowTextInput(false);
	};

	const isSquare =
		Math.abs(
			object.style.width * sheetSize.width -
				object.style.height * sheetSize.height
		) < 1;

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
						isAligned={!object.style.transform.rotate}
						isSquare={isSquare}
						borderRadius={borderRadiusInPixels}
						onEdit={onEdit}
						onDelete={onDelete}
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
