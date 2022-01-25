import MainLogo from "../MainLogo";
import classes from "./index.module.css";

const MainHeader = () => {
	return (
		<header className={classes.header}>
			<div className={classes.column}>
				<button className={classes.openNavBtn}>
					<i className="fas fa-bars" />
				</button>
				<MainLogo />
			</div>
			<div className={classes.column}>
				<img
					src="https://lh3.googleusercontent.com/ogw/ADea4I5bTzDF6IKYZRSEBgilnpwCo6YSqpLZKI8JQkgN=s83-c-mo"
					alt="profile"
					className={classes.profileImage}
				/>
			</div>
		</header>
	);
};

export default MainHeader;
