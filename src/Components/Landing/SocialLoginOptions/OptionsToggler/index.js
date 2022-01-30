import classes from "./index.module.css";

const OptionsToggler = ({ isOpen, onToggle }) => {
	const togglerClassName = `${classes.toggler} ${
		isOpen ? classes["toggler--open"] : ""
	}`;

	return (
		<div className={togglerClassName}>
			<div className={classes.border} />
			<button onClick={onToggle}>
				<i className="fas fa-chevron-up" />
			</button>
			<span onClick={onToggle}>옵션 {isOpen ? "숨기기" : "더보기"}</span>
			<div className={classes.border} />
		</div>
	);
};

export default OptionsToggler;
