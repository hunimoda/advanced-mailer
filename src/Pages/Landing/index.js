import { Link } from "react-router-dom";
import { signInWithGoogle } from "../../Firebase/auth";

const Landing = () => {
	const onGoogleLoginClick = () => {
		signInWithGoogle().then((user) => console.log(user));
	};

	return (
		<>
			<p>ㅇㅇㅇㅇ</p>
			<p>배경 사진</p>
			<h1>APP NAME</h1>
			<p>App description</p>
			<button>더보기</button>
			<button onClick={onGoogleLoginClick}>G | 구글 로그인</button>
			<Link to="/sign-in">이메일로 로그인</Link>
			<Link to="/sign-up">회원가입</Link>
		</>
	);
};

export default Landing;
