import classes from "./index.module.css";

const SettingItem = (props) => {
	const { title, type, initValue, property, onChange } = props;

	const onCustomOptionClick = (event) => {
		onChange({
			target: {
				dataset: { property },
				value: JSON.parse(event.currentTarget.dataset.value),
			},
		});
	};

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
	} else if (type === "custom-select") {
		const objectToOrderedString = (object) => {
			const orderedObject = Object.keys(object)
				.sort()
				.reduce((obj, key) => {
					obj[key] = object[key];
					return obj;
				}, {});

			return JSON.stringify(orderedObject);
		};

		controlJsx = (
			<ul className={classes.customSelect}>
				{props.options.map((option) => {
					let parentClassName = classes.customOption;
					const id = objectToOrderedString(option.value);

					if (id === objectToOrderedString(initValue)) {
						parentClassName += ` ${props.selectedClass}`;
					}

					return (
						<li
							onClick={onCustomOptionClick}
							key={id}
							data-value={JSON.stringify(option.value)}
							className={parentClassName}
						>
							{option.jsx}
						</li>
					);
				})}
			</ul>
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
