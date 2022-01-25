import { Link } from "react-router-dom";

const MainNavigation = () => {
	return (
		<nav>
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
				<li>계정</li>
				<li>로그아웃</li>
			</ul>
		</nav>
	);
};

export default MainNavigation;
