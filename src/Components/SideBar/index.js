import Backdrop from "../../UI/Backdrop";
import MainLogo from "../MainLogo";
import MainNavigation from "./MainNavigation";
import classes from "./index.module.css";

const SideBar = ({ isActive, onSideBarClose }) => {
	const sidebarClassName = `${classes.sidebar} ${
		isActive ? classes["sidebar--active"] : ""
	}`;

	return (
		<>
			<Backdrop isActive={isActive} onClick={onSideBarClose} />
			<section className={sidebarClassName}>
				<header className={classes.header}>
					<button className={classes.closeNavBtn} onClick={onSideBarClose}>
						<i className="fas fa-times" />
					</button>
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
