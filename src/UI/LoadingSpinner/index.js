import classes from "./index.module.css";

const LoadingSpinner = ({ className }) => {
	return (
		<div className={`${classes["lds-roller"]} ${className}`}>
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
		</div>
	);
};

export default LoadingSpinner;
