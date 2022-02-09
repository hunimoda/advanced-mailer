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

const convertStyleValue = (prop, value, sheetSize, scale) => {
	if (prop === "height") {
		value = `${(sheetSize.height * value) / (scale ?? 1)}px`;
	} else if (prop === "width") {
		value = `${(sheetSize.width * value) / (scale ?? 1)}px`;
	} else if (["top", "left"].includes(prop)) {
		value = `${value * 100}%`;
	} else if (prop === "transform") {
		value = convertTransformValue(value);
	}

	return value;
};

const processStyle = (style, sheetSize) => {
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

const createContentJsx = (type, value, contentStyle) => {
	if (type === "image") {
		return (
			<img
				className={classes.content}
				src={value}
				alt=""
				style={contentStyle}
			/>
		);
	} else if (type === "text") {
		return (
			<p className={classes.content} style={contentStyle}>
				{value}
			</p>
		);
	}

	return null;
};

let prevCoord = null;

const InnerObject = ({
	id,
	object,
	sheetSize,
	onMove,
	onDelete,
	onSelect,
	selected,
}) => {
	const { type, value, style } = object;
	const [objectStyle, contentStyle, scale] = processStyle(style, sheetSize);

	const content = createContentJsx(type, value, contentStyle);

	const modifier = (
		<>
			<div
				className={classes.border}
				style={{
					borderWidth: `${1 / scale}px`,
					transform: `translate(-${1 / scale}px, -${1 / scale}px)`,
				}}
			/>
			<div
				className={classes.center}
				style={{ transform: `scale(${1 / scale}) translate(-50%, -50%)` }}
			/>
			<button
				className={classes.delete}
				style={{ transform: `scale(${1 / scale}) translate(50%, -50%)` }}
				onClick={() => onDelete(id)}
				onTouchMove={(event) => event.stopPropagation()}
			>
				<i className="fas fa-times" />
			</button>
			<span
				className={classes.resize}
				style={{ transform: `scale(${1 / scale}) translate(50%, 50%)` }}
				onTouchMove={(event) => event.stopPropagation()}
			>
				<i className="fas fa-arrows-alt-h" />
			</span>
		</>
	);

	const onTouchStart = (event) => {
		onSelect(id);

		const { screenX: x, screenY: y } = event.touches[0];

		prevCoord = { x, y };
	};

	const onTouchMove = (event) => {
		if (selected) {
			const { screenX: x, screenY: y } = event.touches[0];

			const left = (x - prevCoord.x) / sheetSize.width;
			const top = (y - prevCoord.y) / sheetSize.height;

			onMove(id, { left, top });

			prevCoord = { x, y };
		}
	};

	const onTouchEnd = () => (prevCoord = null);

	return (
		<div
			className={classes.object}
			style={objectStyle}
			onTouchStart={onTouchStart}
			onTouchMove={onTouchMove}
			onTouchEnd={onTouchEnd}
		>
			{selected && modifier}
			{content}
		</div>
	);
};

export default InnerObject;