import MainNavigation from "./MainNavigation";
import MainLogo from "../MainLogo";
import classes from "./index.module.css";

const SideBar = () => {
	return (
		<>
			<div className={classes.backdrop} />
			<section className={classes.sidebar}>
				<header className={classes.header}>
					<i
						className="fas fa-times"
						style={{
							color: "var(--icon-grey)",
							fontSize: "22px",
							width: "19.25px",
							textAlign: "center",
						}}
					/>
					<MainLogo />
				</header>
				<MainNavigation />
				<footer>
					<small>© 2022 HUNIMODA</small>
				</footer>
			</section>
		</>
	);
};

export default SideBar;
