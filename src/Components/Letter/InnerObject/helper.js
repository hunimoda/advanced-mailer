import store from "../../../Context";
import { letterActions } from "../../../Context/letter";
import classes from "./index.module.css";

const OBJECT_STYLE_PROPS = [
	"top",
	"left",
	"width",
	"height",
	"zIndex",
	"transform",
];

const convertTransformValue = (value) => {
	let convertedValue = "";

	Object.entries(value).forEach(([transformProp, transformValue]) => {
		if (transformProp === "rotate") {
			convertedValue += ` rotate(${transformValue}deg)`;
		} else if (transformProp === "scale") {
			convertedValue += ` scale(${transformValue})`;
		}
	});

	return convertedValue;
};

const convertStyleValue = (style, prop, value, sheetSize, scale) => {
	if (prop === "height") {
		value = `${(sheetSize.height * value) / (scale ?? 1)}px`;
	} else if (prop === "width") {
		value = `${(sheetSize.width * value) / (scale ?? 1)}px`;
	} else if (["top", "left"].includes(prop)) {
		value = `${value * 100}%`;
	} else if (prop === "transform") {
		value = convertTransformValue(value);
	} else if (prop === "color" || prop === "backgroundColor") {
		const rgbMatch = value.rgb
			.match(/#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i)
			.slice(1, 4)
			.map((hex) => parseInt(hex, 16));

		value = `rgba(${rgbMatch[0]}, ${rgbMatch[1]}, ${rgbMatch[2]}, ${
			1 - value.transparency
		})`;
	} else if (prop === "textShadow") {
		value = value.size
			? `0px 0px ${value.size * sheetSize.height}px ${value.color}`
			: null;
	} else if (prop === "boxShadow") {
		const scaledDimension = value.dimension.map((px) => px / scale);

		value = `${value.color} ${scaledDimension[0]}px ${scaledDimension[1]}px ${scaledDimension[2]}px`;
	} else if (prop === "border") {
		value = `${(value.width * sheetSize.height) / (scale ?? 1)}px solid ${
			value.color
		}`;
	} else if (prop === "borderRadius") {
		const objectWidthPx = style.width * sheetSize.width;
		const objectHeightPx = style.height * sheetSize.height;
		const minSideLengthPx = Math.min(objectWidthPx, objectHeightPx);

		value = `${(value * minSideLengthPx) / (scale ?? 1) / 2}px`;
	} else if (prop === "padding") {
		value = `${(value * sheetSize.height) / (scale ?? 1)}px`;
	}

	return value;
};

export const getObjectById = (id) => store.getState().letter.objects[id];

const getObjectStyle = (id) => store.getState().letter.objects[id].style;

const getSheetSize = () => store.getState().letter.sheet.size;

export const getScale = (id) => getObjectStyle(id).transform?.scale;

export const processStyle = (style, sheetSize) => {
	sheetSize ??= getSheetSize();

	const containerStyle = {};
	const contentStyle = { fontSize: `${sheetSize.height}px` };
	const scale = style.transform?.scale;

	Object.entries(style).forEach(([prop, value]) => {
		const convertedValue = convertStyleValue(
			style,
			prop,
			value,
			sheetSize,
			scale
		);

		if (OBJECT_STYLE_PROPS.includes(prop)) {
			containerStyle[prop] = convertedValue;
		} else {
			contentStyle[prop] = convertedValue;
		}
	});

	return {
		containerStyle,
		contentStyle,
		scale: scale ?? 1,
	};
};

export const moveObject = (id, left, top) => {
	const { width, height } = getSheetSize();

	store.dispatch(
		letterActions.moveObject({ id, left: left / width, top: top / height })
	);
};

const getMinSideLength = (id) => {
	const objectStyle = getObjectStyle(id);
	const sheetSize = getSheetSize();

	return Math.max(
		(objectStyle.padding + objectStyle.border.width) * 2 * sheetSize.height,
		30
	);
};

export const resizeObjectFixedAspectRatio = (
	id,
	centerPosition,
	touchPosition
) => {
	const objectStyle = getObjectStyle(id);
	const sheetSize = getSheetSize();

	const diagonalVector = {
		x: touchPosition.x - centerPosition.x,
		y: touchPosition.y - centerPosition.y,
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
		(objectStyle.height * sheetSize.height) /
			(objectStyle.width * sheetSize.width)
	);

	const minDiagonalLength =
		getMinSideLength(id) /
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

	store.dispatch(
		letterActions.resizeObjectFixedAspectRatio({
			id,
			width,
			height,
			angle:
				THRESHOLD_DEGREE < rotateDegree && rotateDegree < 360 - THRESHOLD_DEGREE
					? rotateDegree
					: 0,
		})
	);
};

const dotProduct = (vector1, vector2) =>
	vector1.x * vector2.x + vector1.y * vector2.y;

export const resizeObjectSide = (id, centerPosition, touchPosition, side) => {
	const objectStyle = getObjectStyle(id);
	const sheetSize = getSheetSize();

	const rotateAngle = (objectStyle.transform.rotate * Math.PI) / 180;
	const correctedAngle = rotateAngle + (side === "height" ? Math.PI / 2 : 0);
	const normalVector = {
		x: Math.cos(correctedAngle),
		y: Math.sin(correctedAngle),
	};

	const lineConstant = -dotProduct(normalVector, centerPosition);

	const signedDistance = dotProduct(normalVector, touchPosition) + lineConstant;

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
			getMinSideLength(id),
			Math.abs(signedDistance)
		);
		const referenceLengthPx =
			side === "height"
				? objectStyle.width * sheetSize.width
				: objectStyle.height * sheetSize.height;

		if (Math.abs(calculatedLengthPx - referenceLengthPx) < 3) {
			calculatedLengthPx = referenceLengthPx;
		}

		store.dispatch(
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

export const getContentJsx = (type, value, contentStyle) => {
	if (type === "image") {
		return (
			<img
				data-type="content"
				className={classes.content}
				style={contentStyle}
				src={value}
				alt=""
			/>
		);
	} else if (type === "text") {
		return (
			<p className={classes.content} style={contentStyle} data-type="content">
				{value}
			</p>
		);
	}

	return null;
};

export const isSquare = (id) => {
	const objectStyle = getObjectStyle(id);
	const sheetSize = getSheetSize();

	return (
		Math.abs(
			objectStyle.width * sheetSize.width -
				objectStyle.height * sheetSize.height
		) < 1
	);
};

export const isAligned = (id) => !getObjectStyle(id).transform.rotate;

export const getBorderRadius = (id) => {
	const objectStyle = getObjectStyle(id);
	const sheetSize = getSheetSize();

	return (
		(objectStyle.borderRadius *
			Math.min(
				objectStyle.width * sheetSize.width,
				objectStyle.height * sheetSize.height
			)) /
		2 /
		getScale(id)
	);
};

export const getObjectSize = (id) => {
	const objectStyle = getObjectStyle(id);
	const sheetSize = getSheetSize();

	return {
		x: objectStyle.left * sheetSize.width,
		y: objectStyle.top * sheetSize.height,
	};
};
