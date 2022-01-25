import classes from "./index.module.css";
import { Link } from "react-router-dom";

const MainNavigation = () => {
	return (
		<nav className={classes.mainNavigation}>
			<ul>
				<li>
					<Link to="/new">편지 쓰기</Link>
				</li>
			</ul>
			<ul>
				<li>
					<Link to="/inbox">받은 편지함</Link>
				</li>
				<li>
					<Link to="/sent">보낸 편지함</Link>
				</li>
				<li>
					<Link to="/drafts">임시 보관함</Link>
				</li>
			</ul>
			<ul>
				<li>
					<span>계정</span>
				</li>
				<li>
					<span>로그아웃</span>
				</li>
			</ul>
		</nav>
	);
};

export default MainNavigation;
