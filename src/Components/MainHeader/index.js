import { useState, useEffect } from "react";
import MainLogo from "../MainLogo";
import { getMyProfile } from "../../Helper/profile";
import classes from "./index.module.css";

const MainHeader = ({ onSideBarOpen, onProfileOpen }) => {
	const [imageClassName, setImageClassName] = useState(classes.profileImage);
	const [profileImage, setProfileImage] = useState(null);

	useEffect(() => {
		getMyProfile().then(({ image }) => setProfileImage(image));
	}, []);

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
				{profileImage && (
					<img
						src={profileImage}
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
