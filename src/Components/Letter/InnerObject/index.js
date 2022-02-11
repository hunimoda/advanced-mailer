import { useState } from "react";
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
let clickedAfterSelected = null;
let timer = null;
const TOUCH_DURATION = 1000;

const onLongTouch = () => {
	clickedAfterSelected = false;
	alert("Show object settings");
};

const InnerObject = ({
	id,
	object,
	sheetSize,
	onMove,
	onResize,
	onResizeLength,
	onDelete,
	onSelect,
	selected,
}) => {
	const { type, value, style } = object;
	const [objectStyle, contentStyle, scale] = processStyle(style, sheetSize);

	const [isAspectRatioFixed, setIsAspectRatioFixed] = useState(
		type === "image" ? true : false
	);

	const content = createContentJsx(type, value, contentStyle);

	const onTouchStart = (event) => {
		event.stopPropagation();

		timer = setTimeout(onLongTouch, TOUCH_DURATION);

		if (selected) {
			clickedAfterSelected = true;
		} else {
			onSelect(id);
		}

		const { clientX: x, clientY: y } = event.touches[0];

		prevCoord = { x, y };
	};

	const onTouchMove = (event) => {
		event.stopPropagation();
		clickedAfterSelected = false;

		if (timer) {
			clearTimeout(timer);
		}

		if (selected) {
			const { clientX: x, clientY: y } = event.touches[0];
			const targetType = event.currentTarget.dataset.type;

			if (targetType === "object") {
				const left = (x - prevCoord.x) / sheetSize.width;
				const top = (y - prevCoord.y) / sheetSize.height;

				onMove(id, { left, top });
			} else if (targetType === "resize-and-rotate") {
				onResize(id, { x, y });
			} else if (targetType === "resize-width") {
				onResizeLength(id, { x, y }, false);
			} else if (targetType === "resize-height") {
				onResizeLength(id, { x, y }, true);
			}

			prevCoord = { x, y };
		}
	};

	const onTouchEnd = () => {
		if (clickedAfterSelected) {
			setIsAspectRatioFixed((prev) => !prev);
		}
		if (timer) {
			clearTimeout(timer);
		}

		clickedAfterSelected = null;
		prevCoord = null;
	};

	const modifier = (
		<>
			<div
				className={`${classes.border} ${
					!style.transform.rotate ? classes["border--aligned"] : ""
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
				onClick={() => onDelete(id)}
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

	return (
		<div
			data-type="object"
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
