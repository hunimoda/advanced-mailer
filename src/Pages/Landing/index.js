import { Link } from "react-router-dom";
import BackgroundImage from "../../Components/BackgroundImage";
import OpeningText from "../../Components/OpeningText";
import SocialLoginOptions from "../../Components/SocialLoginOptions";
import classes from "./index.module.css";

const Landing = () => {
	return (
		<div className={classes.landing}>
			<div className={classes.circleContainer}>
				<div className={classes.circle} />
				<div className={`${classes.circle} ${classes["circle--highlight"]}`} />
				<div className={classes.circle} />
				<div className={classes.circle} />
			</div>
			<BackgroundImage url="https://wallpapercave.com/uwp/uwp846324.jpeg" />
			<OpeningText className={classes.openingText}>
				소중한 사람에게 마음을 담아
				<br />
				편지를 작성해보세요
			</OpeningText>
			<SocialLoginOptions className={classes.socialLoginOptions} />
			<div className={classes.links}>
				<Link to="/sign-in">이메일로 로그인</Link>/
				<Link to="/sign-up">회원가입</Link>
			</div>
		</div>
	);
};

export default Landing;
