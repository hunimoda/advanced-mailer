import Backdrop from "../../UI/Backdrop";
import MainLogo from "../MainLogo";
import MainNavigation from "./MainNavigation";
import classes from "./index.module.css";

const SideBar = ({ isActive, onSideBarClose, onProfileOpen }) => {
	const sidebarClassName = `${classes.sidebar} ${
		isActive ? classes["sidebar--active"] : ""
	}`;

	return (
		<>
			<Backdrop isActive={isActive} onClick={onSideBarClose} />
			<aside className={sidebarClassName}>
				<header className={classes.header}>
					<button className={classes.closeNavBtn} onClick={onSideBarClose}>
						<i className="fas fa-times" />
					</button>
					<MainLogo />
				</header>
				<MainNavigation
					onLinkClick={onSideBarClose}
					onAccountClick={onProfileOpen}
				/>
				<footer className={classes.sidebarFooter}>
					<small>© 2022 HUNIMODA</small>
				</footer>
			</aside>
		</>
	);
};

export default SideBar;
