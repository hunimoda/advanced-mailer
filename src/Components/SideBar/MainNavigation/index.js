import classes from "./index.module.css";
import { Link } from "react-router-dom";

const MainNavigation = ({ onLinkClick }) => {
	return (
		<nav className={classes.mainNavigation}>
			<ul>
				<li>
					<Link to="/new" onClick={onLinkClick}>
						편지 쓰기
					</Link>
				</li>
			</ul>
			<ul>
				<li>
					<Link to="/inbox" onClick={onLinkClick}>
						받은 편지함
					</Link>
				</li>
				<li>
					<Link to="/sent" onClick={onLinkClick}>
						보낸 편지함
					</Link>
				</li>
				<li>
					<Link to="/drafts" onClick={onLinkClick}>
						임시 보관함
					</Link>
				</li>
			</ul>
			<ul>
				<li>
					<span onClick={onLinkClick}>계정</span>
				</li>
				<li>
					<span onClick={onLinkClick}>로그아웃</span>
				</li>
			</ul>
		</nav>
	);
};

export default MainNavigation;
