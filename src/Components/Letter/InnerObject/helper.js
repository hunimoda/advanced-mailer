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

export const processStyle = (style, sheetSize) => {
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

	return [containerStyle, contentStyle, scale ?? 1];
};
