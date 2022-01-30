import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CarouselIndicator from "../../Components/CarouselIndicator";
import BackgroundImage from "../../Components/BackgroundImage";
import OpeningText from "../../Components/OpeningText";
import SocialLoginOptions from "../../Components/SocialLoginOptions";
import classes from "./index.module.css";

const DUMMY_DISPLAYS = [
	{
		bgImage: "https://wallpapercave.com/uwp/uwp846324.jpeg",
		text: "소중한 사람에게 마음을 담아\n편지를 작성해보세요",
	},
	{
		bgImage: "https://iso.500px.com/wp-content/uploads/2014/07/big-one.jpg",
		text: "아이패드 사용자이신가요?\n손글씨를 남겨 정성을 전하세요",
	},
	{
		bgImage:
			"https://img2.10bestmedia.com/Images/Photos/362106/dark-hedges_54_990x660.jpg",
		text: "여러분만의 개성과 감각으로\n편지를 꾸며보아요",
	},
];

const Landing = () => {
	const [displayItemIndex, setDisplayItemIndex] = useState(0);
	const displayItemsLength = DUMMY_DISPLAYS.length;

	useEffect(() => {
		setInterval(() => {
			setDisplayItemIndex((prevIndex) => (prevIndex + 1) % displayItemsLength);
		}, 9000);
	}, [displayItemsLength]);

	return (
		<div className={classes.landing}>
			<CarouselIndicator length={displayItemsLength} index={displayItemIndex} />
			{DUMMY_DISPLAYS.map((display, index) => (
				<BackgroundImage
					url={display.bgImage}
					className={`${classes.backgroundImage} ${
						index === displayItemIndex ? classes["backgroundImage--active"] : ""
					}`}
				/>
			))}
			<OpeningText className={classes.openingText}>
				{DUMMY_DISPLAYS[displayItemIndex].text}
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
