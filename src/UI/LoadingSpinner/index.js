import classes from "./index.module.css";

const LoadingSpinner = ({ className }) => {
	return <i className={`fas fa-spinner ${classes.spinner}`} />;
};

export default LoadingSpinner;
