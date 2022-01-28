import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInWithGoogle } from "../../Context/auth";
import classes from "./index.module.css";

const Landing = () => {
	const dispatch = useDispatch();

	const onGoogleLoginClick = () => {
		dispatch(signInWithGoogle());
	};

	return (
		<>
			<div className={classes.circleContainer}>
				<div className={classes.circle} />
				<div className={classes.circle} />
				<div className={classes.circle} />
				<div className={classes.circle} />
			</div>
			{/* <div className={classes.bgImage} /> */}
			<div className={classes.openingText}>
				<h1 className={classes.appName}>Mailer</h1>
				<p className={classes.description}>
					소중한 사람에게 마음을 담아
					<br />
					편지를 작성해보세요
				</p>
			</div>
			<div className={classes.bottomContainer}>
				<button className={classes.openOptionsBtn}>
					<i className="fas fa-chevron-up" />
				</button>
				<div className={classes.loginOptions}>
					<button onClick={onGoogleLoginClick} className={classes.google}>
						<span>
							<i className="fab fa-google" />
						</span>
						<span>구글 로그인</span>
					</button>
					<button onClick={onGoogleLoginClick} className={classes.kakao}>
						<span>
							<i className="fas fa-comment" />
						</span>
						<span>카카오 로그인</span>
					</button>
					<button onClick={onGoogleLoginClick} className={classes.naver}>
						<span>
							<i className="fab fa-neos" />
						</span>
						<span>네이버 로그인</span>
					</button>
				</div>
			</div>
			<div className={classes.links}>
				<Link to="/sign-in">이메일로 로그인</Link>/
				<Link to="/sign-up">회원가입</Link>
			</div>
		</>
	);
};

export default Landing;
