import classes from "./index.module.css";

const Object = ({ type, value, style, sheetSize }) => {
	const cssStyle = { fontSize: `${sheetSize.height}px` };

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

		cssStyle[prop] = value;
	}

	switch (type) {
		case "image":
			return (
				<img className={classes.object} src={value} alt="" style={cssStyle} />
			);
		case "text":
			return (
				<p className={classes.object} style={cssStyle}>
					{value}
				</p>
			);
		default:
			return null;
	}
};

export default Object;
