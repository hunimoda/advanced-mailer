import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getMyUid } from "../../Firebase/auth";
import { getMyProfile } from "../../Helper/profile";
import MainLogo from "../MainLogo";
import classes from "./index.module.css";

const MainHeader = ({ onSideBarOpen, onProfileOpen }) => {
	const myProfile = useSelector((state) => state.profile[getMyUid()]);

	const [imageClassName, setImageClassName] = useState(classes.profileImage);

	useEffect(() => {
		if (!myProfile) {
			getMyProfile();
		}
	}, [myProfile]);

	const onProfileImageClick = () => {
		setImageClassName(
			`${classes.profileImage} ${classes["profileImage--clicked"]}`
		);
		setTimeout(() => setImageClassName(classes.profileImage), 500);
		onProfileOpen();
	};

	return (
		<header className={classes.header}>
			<div className={classes.column}>
				<button className={classes.openNavBtn} onClick={onSideBarOpen}>
					<i className="fas fa-bars" />
				</button>
				<MainLogo />
			</div>
			<div className={classes.column}>
				{myProfile?.image && (
					<img
						src={myProfile.image}
						alt="profile"
						className={imageClassName}
						onClick={onProfileImageClick}
					/>
				)}
			</div>
		</header>
	);
};

export default MainHeader;
