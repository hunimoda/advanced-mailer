import MainNavigation from "./MainNavigation";
import classes from "./index.module.css";

const SideBar = () => {
	return (
		<section className={classes.section}>
			<header>
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
			</header>
			<MainNavigation />
			<footer>
				<small>© 2022 HUNIMODA</small>
			</footer>
		</section>
	);
};

export default SideBar;
