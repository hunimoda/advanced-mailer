import classes from "./index.module.css";
import { Link } from "react-router-dom";

const MainNavigation = (props) => {
	const { onLinkClick: onSideBarClose, onAccountClick: onProfileOpen } = props;

	const onAccountClick = () => {
		onSideBarClose();
		onProfileOpen();
	};

	return (
		<nav className={classes.mainNavigation}>
			<ul>
				<li>
					<Link to="/new" onClick={onSideBarClose}>
						편지 쓰기
					</Link>
				</li>
			</ul>
			<ul>
				<li>
					<Link to="/inbox" onClick={onSideBarClose}>
						받은 편지함
					</Link>
				</li>
				<li>
					<Link to="/sent" onClick={onSideBarClose}>
						보낸 편지함
					</Link>
				</li>
				<li>
					<Link to="/drafts" onClick={onSideBarClose}>
						임시 보관함
					</Link>
				</li>
			</ul>
			<ul>
				<li>
					<span onClick={onAccountClick}>계정</span>
				</li>
				<li>
					<span onClick={onSideBarClose}>로그아웃</span>
				</li>
			</ul>
		</nav>
	);
};

export default MainNavigation;
