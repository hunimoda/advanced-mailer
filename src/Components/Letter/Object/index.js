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

	return [objectStyle, contentStyle];
};

const Object = ({ type, value, style, sheetSize }) => {
	const [objectStyle, contentStyle] = processStyle(style, sheetSize);

	let content = null;

	switch (type) {
		case "image":
			content = (
				<img
					className={classes.content}
					src={value}
					alt=""
					style={contentStyle}
				/>
			);
			break;
		case "text":
			content = (
				<p className={classes.content} style={contentStyle}>
					{value}
				</p>
			);
			break;
		default:
	}

	return (
		<div className={classes.object} style={objectStyle}>
			{content}
		</div>
	);
};

export default Object;
