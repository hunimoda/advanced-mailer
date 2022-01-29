import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import SocialLoginButton from "../../Components/SocialLoginButton";
import { signInWithGoogle } from "../../Context/auth";
import classes from "./index.module.css";

const Landing = () => {
	const dispatch = useDispatch();

	const [isOptionsOpen, setIsOptionsOpen] = useState(false);

	const optionsClassName = `${classes.bottomContainer} ${
		isOptionsOpen ? classes["bottomContainer--open"] : ""
	}`;

	const onToggleOpenClick = () => setIsOptionsOpen((prev) => !prev);

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
			<div className={optionsClassName}>
				<button onClick={onToggleOpenClick}>
					<i className="fas fa-chevron-up" />
				</button>
				<span onClick={onToggleOpenClick}>
					옵션 {isOptionsOpen ? "숨기기" : "더보기"}
				</span>
				<div className={classes.loginOptions}>
					<SocialLoginButton
						className={classes.google}
						onClick={onGoogleLoginClick}
						icon="fab fa-google"
						value="구글 로그인"
					/>
					<SocialLoginButton
						className={classes.kakao}
						onClick={onGoogleLoginClick}
						icon="fas fa-comment"
						value="카카오 로그인"
					/>
					<SocialLoginButton
						className={classes.naver}
						onClick={onGoogleLoginClick}
						icon="fab fa-neos"
						value="네이버 로그인"
					/>
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
