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

const convertStyleValue = (prop, value, sheetSize, scale) => {
	if (prop === "height") {
		value = `${(sheetSize.height * value) / (scale ?? 1)}px`;
	} else if (prop === "width") {
		value = `${(sheetSize.width * value) / (scale ?? 1)}px`;
	} else if (["top", "left"].includes(prop)) {
		value = `${value * 100}%`;
	} else if (prop === "transform") {
		value = convertTransformValue(value);
	} else if (prop === "textShadow") {
		value = `0px 0px ${value.size * sheetSize.height}px ${value.color}`;
	} else if (prop === "border") {
		value = `${(value.width * sheetSize.height) / (scale ?? 1)}px solid ${
			value.color
		}`;
	}

	return value;
};

export const processStyle = (style, sheetSize) => {
	const objectStyle = {};
	const contentStyle = { fontSize: `${sheetSize.height}px` };
	const scale = style.transform?.scale;

	Object.entries(style).forEach(([prop, value]) => {
		const convertedValue = convertStyleValue(prop, value, sheetSize, scale);

		if (OBJECT_STYLE_PROPS.includes(prop)) {
			objectStyle[prop] = convertedValue;
		} else {
			contentStyle[prop] = convertedValue;
		}
	});

	return [objectStyle, contentStyle, scale ?? 1];
};
