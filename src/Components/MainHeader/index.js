import classes from "./index.module.css";

const MainHeader = () => {
	return (
		<header className={classes.header}>
			<div className={classes.column}>
				<i
					className="fas fa-bars"
					style={{ color: "#595959", fontSize: "22px" }}
				/>
				<i
					className="fab fa-mailchimp"
					style={{
						marginLeft: "22px",
						marginRight: "18px",
						color: "#f5850e",
						fontSize: "30px",
					}}
				/>
				<h1 className={classes.appName}>Mailer</h1>
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
