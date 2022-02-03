import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getMyProfile } from "../../Helper/profile";
import { signOut } from "../../Context/auth";
import classes from "./index.module.css";

const MyProfile = ({ onProfileClose }) => {
	const [profile, setProfile] = useState({});
	const { name, image } = profile;

	const dispatch = useDispatch();
	const history = useHistory();

	useEffect(() => getMyProfile().then((profile) => setProfile(profile)), []);

	useEffect(() => {
		const closeProfile = () => onProfileClose();

		window.addEventListener("click", closeProfile);

		return () => window.removeEventListener("click", closeProfile);
	}, [onProfileClose]);

	const onProfileClick = (event) => {
		event.stopPropagation();
	};

	const onSignOutClick = () => {
		dispatch(signOut());
		onProfileClose();
		history.replace("/");
	};

	return (
		<div className={classes.myProfile} onClick={onProfileClick}>
			<div className={classes.profileImage}>
				{image && <img src={image} alt="profile" />}
				<div className={classes.cameraBtnOuter}>
					<button className={classes.cameraBtn}>
						<i className="fas fa-camera-retro" />
					</button>
				</div>
			</div>
			<div className={classes.myNameContainer}>
				{name && <h3 className={classes.myName}>{name}</h3>}
				<i className="fas fa-edit" />
			</div>
			<p className={classes.myEmail}>hunimoda@gmail.com</p>
			<div className={classes.signoutBtnContainer}>
				<button className={classes.signoutBtn} onClick={onSignOutClick}>
					로그아웃
				</button>
			</div>
		</div>
	);
};

export default MyProfile;
