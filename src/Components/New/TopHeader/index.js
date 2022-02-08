import classes from "./index.module.css";

const TopHeader = () => {
	return (
		<header className={classes.header}>
			<button>
				<i className="fas fa-times" />
			</button>
			<div className={classes.controls}>
				<button>저장</button>
				<button>완료</button>
			</div>
		</header>
	);
};

export default TopHeader;
