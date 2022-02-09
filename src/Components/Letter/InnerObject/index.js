import classes from "./index.module.css";

const processStyle = (style, sheetSize) => {
	const objectStyle = {};
	const contentStyle = { fontSize: `${sheetSize.height}px` };

	let scale = null;

	if (
		style.hasOwnProperty("transform") &&
		style.transform.hasOwnProperty("scale")
	) {
		scale = style.transform.scale;
	}

	for (const prop in style) {
		let value = style[prop];

		switch (prop) {
			case "height":
				value = `${(sheetSize.height * value) / (scale ?? 1)}px`;
				break;
			case "width":
				value = `${(sheetSize.width * value) / (scale ?? 1)}px`;
				break;
			case "top":
			case "left":
				value = `${value * 100}%`;
				break;
			case "transform":
				const transform = value;
				value = "";

				for (const transformProp in transform) {
					let transformValue = transform[transformProp];

					switch (transformProp) {
						case "rotate":
							value += ` rotate(${transformValue}deg)`;
							break;
						case "scale":
							value += ` scale(${transformValue})`;
							break;
						default:
					}
				}
				break;
			default:
		}

		switch (prop) {
			case "top":
			case "left":
			case "width":
			case "height":
			case "transform":
				objectStyle[prop] = value;
				break;
			default:
				contentStyle[prop] = value;
		}
	}

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

const InnerObject = ({ id, object, sheetSize, onMove, onDelete, selected }) => {
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
			>
				<i className="fas fa-times" />
			</button>
			<span
				className={classes.resize}
				style={{ transform: `scale(${1 / scale}) translate(50%, 50%)` }}
			>
				<i className="fas fa-arrows-alt-h" />
			</span>
		</>
	);

	const onTouchStart = (event) => {
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
