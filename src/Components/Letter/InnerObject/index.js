import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { letterActions } from "../../../Context/letter";
import ObjectSettings from "./ObjectSettings";
import { processStyle } from "./helper";
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
}) => {
	const dispatch = useDispatch();
	const sheetSize = useSelector((state) => state.letter.sheet.size);
	const object = useSelector((state) => state.letter.objects[id]);

	const [containerStyle, contentStyle, scale] = processStyle(
		forcedStyle ?? object.style,
		sheetSize
	);

	const [isAspectRatioFixed, setIsAspectRatioFixed] = useState(
		object.type === "image" ? true : false
	);
	const [showObjectSettings, setShowObjectSettings] = useState(false);

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

		const width =
			(Math.max(diagonalLength, 30) * Math.cos(objectAngle)) / sheetSize.width;
		const height =
			(Math.max(diagonalLength, 30) * Math.sin(objectAngle)) / sheetSize.height;

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
			dispatch(
				letterActions.resizeObjectSide({
					id,
					length:
						Math.max(30, Math.abs(signedDistance)) /
						(side === "height" ? sheetSize.height : sheetSize.width),
					side,
				})
			);
		}
	};

	const deleteObject = () => {
		dispatch(letterActions.deleteObject(id));
		onSelectChange(id, false);
	};

	const onLongTouch = () => {
		clickedAfterSelected = false;
		setShowObjectSettings(true);
	};

	const onTouchStart = (event) => {
		if (readOnly) {
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
		if (readOnly) {
			return;
		}

		event.stopPropagation();

		clearTimeout(timer);
		clickedAfterSelected = false;

		if (selected) {
			const { clientX: x, clientY: y } = event.touches[0];
			const targetType = event.currentTarget.dataset.type;

			if (targetType === "object") {
				moveObject(
					(x - prevCoord.x) / sheetSize.width,
					(y - prevCoord.y) / sheetSize.height
				);
			} else if (targetType === "resize-and-rotate") {
				resizeObjectFixedAspectRatio(x, y);
			} else if (targetType === "resize-width") {
				resizeObjectSide(x, y, "width");
			} else if (targetType === "resize-height") {
				resizeObjectSide(x, y, "height");
			}

			prevCoord = { x, y };
		}
	};

	const onTouchEnd = () => {
		if (readOnly) {
			return;
		}

		clearTimeout(timer);

		if (clickedAfterSelected) {
			setIsAspectRatioFixed((prev) => !prev);
		}

		clickedAfterSelected = null;
		prevCoord = null;
	};

	const onSettingsClose = () => setShowObjectSettings(false);

	const modifier = (
		<>
			<div
				className={`${classes.border} ${
					!object.style.transform.rotate ? classes["border--aligned"] : ""
				}`}
				style={{
					borderWidth: `${1 / scale}px`,
					transform: `translate(-${1 / scale}px, -${1 / scale}px)`,
				}}
			/>
			<button
				className={classes.delete}
				style={{
					transform: `scale(${1 / scale}) translate(-50%, -50%)`,
				}}
				onClick={deleteObject}
				onTouchMove={(event) => event.stopPropagation()}
			>
				<i className="fas fa-times" />
			</button>
			{isAspectRatioFixed ? (
				<span
					data-type="resize-and-rotate"
					className={classes.resize}
					style={{ transform: `scale(${1 / scale}) translate(50%, 50%)` }}
					onTouchMove={onTouchMove}
				>
					<i className="fas fa-arrows-alt-h" />
				</span>
			) : (
				<>
					<button
						data-type="resize-width"
						className={classes.resizeWidthBtn}
						style={{ transform: `scale(${1 / scale}) translate(50%, -50%)` }}
						onTouchMove={onTouchMove}
					>
						<i className="fas fa-arrows-alt-h" />
					</button>
					<button
						data-type="resize-height"
						className={classes.resizeHeightBtn}
						style={{ transform: `scale(${1 / scale}) translate(50%, 50%)` }}
						onTouchMove={onTouchMove}
					>
						<i className="fas fa-arrows-alt-v" />
					</button>
				</>
			)}
		</>
	);

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

	return (
		<>
			<div
				ref={objectRef}
				data-type="object"
				className={classes.object}
				style={containerStyle}
				onTouchStart={onTouchStart}
				onTouchMove={onTouchMove}
				onTouchEnd={onTouchEnd}
			>
				{selected && modifier}
				{getContentJsx()}
			</div>
			{showObjectSettings && (
				<ObjectSettings
					id={id}
					onClose={onSettingsClose}
					style={object.style}
				/>
			)}
		</>
	);
};

export default InnerObject;
