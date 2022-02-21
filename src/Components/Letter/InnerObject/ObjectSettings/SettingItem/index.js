import classes from "./index.module.css";

const SettingItem = (props) => {
	const { title, type, initValue, property, onChange } = props;

	let controlJsx = <></>;

	if (type === "color") {
		controlJsx = (
			<>
				<label
					htmlFor={property}
					style={{ backgroundColor: initValue }}
					className={`${classes.settingValue} ${classes.colorBtn}`}
				></label>
				<input
					id={property}
					data-property={property}
					type="color"
					onChange={onChange}
				/>
			</>
		);
	} else if (type === "select") {
		controlJsx = (
			<select
				data-property={property}
				onChange={onChange}
				value={initValue}
				className={classes.settingValue}
			>
				{props.options.map((option) => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>
		);
	} else if (type === "range") {
		controlJsx = (
			<input
				data-property={property}
				type="range"
				min={props.min}
				max={props.max}
				step={props.step}
				value={initValue}
				onChange={onChange}
				className={classes.settingValue}
			/>
		);
	}

	return (
		<li className={classes.settingItem}>
			<h4>{title}</h4>
			{controlJsx}
		</li>
	);
};

export default SettingItem;
