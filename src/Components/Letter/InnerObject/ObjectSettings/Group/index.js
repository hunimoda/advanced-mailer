const Group = ({ children, value, format, onChange, property }) => {
	const currentParams = value.match(format.replaceAll(/{[0-9]}/g, "(.*)"));

	const onChildChange = (event) => {
		const {
			dataset: { index, multiplier },
			value,
		} = event.target;

		let returnString = format.replace(
			`{${index}}`,
			multiplier ? `${multiplier * Number(value)}` : value
		);

		while (true) {
			const match = returnString.match(/{([0-9])}/);

			if (!match) {
				break;
			}

			returnString = returnString.replace(
				match[0],
				currentParams[Number(match[1])]
			);
		}

		console.log(returnString);
		onChange({
			target: { dataset: { property }, value: returnString },
		});
	};

	return <ul onChange={onChildChange}>{children}</ul>;
};

export default Group;
