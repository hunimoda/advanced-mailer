import { useEffect } from "react";
import classes from "./index.module.css";

const MyProfile = ({ onProfileClose }) => {
	useEffect(() => {
		const closeProfile = () => onProfileClose();

		window.addEventListener("click", closeProfile);

		return () => window.removeEventListener("click", closeProfile);
	}, [onProfileClose]);

	const onProfileClick = (event) => {
		event.stopPropagation();
	};

	return (
		<div className={classes.myProfile} onClick={onProfileClick}>
			<div className={classes.profileImage}>
				<img
					src="https://lh3.googleusercontent.com/ogw/ADea4I5bTzDF6IKYZRSEBgilnpwCo6YSqpLZKI8JQkgN=s83-c-mo"
					alt="profile"
				/>
				<div className={classes.cameraBtnOuter}>
					<button className={classes.cameraBtn}>
						<i className="fas fa-camera-retro" />
					</button>
				</div>
			</div>
			<div className={classes.myNameContainer}>
				<h3 className={classes.myName}>Daehoon Kim</h3>
				<i className="fas fa-edit" />
			</div>
			<p className={classes.myEmail}>hunimoda@gmail.com</p>
			<div className={classes.signoutBtnContainer}>
				<button className={classes.signoutBtn}>로그아웃</button>
			</div>
		</div>
	);
};

export default MyProfile;