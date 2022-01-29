import { useState } from "react";
import { useDispatch } from "react-redux";
import { signInWithGoogle } from "../../Context/auth";
import OptionsToggler from "./OptionsToggler";
import SocialLoginButton from "../../Components/SocialLoginOptions/SocialLoginButton";
import classes from "./index.module.css";

const SocialLoginOptions = ({ className }) => {
	const [isOpen, setIsOpen] = useState(false);
	const dispatch = useDispatch();

	const optionsClassName = `${classes.options} ${
		isOpen ? classes["options--open"] : ""
	} ${className}`;

	const onToggle = () => setIsOpen((prev) => !prev);

	const onGoogleLoginClick = () => {
		dispatch(signInWithGoogle());
	};

	return (
		<div className={optionsClassName}>
			<OptionsToggler isOpen={isOpen} onToggle={onToggle} />
			<div className={classes.loginBtns}>
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
	);
};

export default SocialLoginOptions;
