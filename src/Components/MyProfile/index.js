import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { profileActions } from "../../Context/profile";
import { signOut } from "../../Context/auth";
import { getMyEmail, getMyUid } from "../../Firebase/auth";
import { uploadProfileImageByDataUrl } from "../../Firebase/storage";
import classes from "./index.module.css";

function getImageDataUrl(event, callback) {
	const {
		target: { files },
	} = event;
	const file = files[0];
	const reader = new FileReader();

	reader.onloadend = (readerEvent) =>
		callback(readerEvent.currentTarget.result);
	reader.readAsDataURL(file);
}

const MyProfile = ({ onProfileClose }) => {
	const history = useHistory();

	const dispatch = useDispatch();
	const myProfile = useSelector((state) => state.profile[getMyUid()]);

	useEffect(() => {}, []);

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

	const onProfileImageChange = (event) => {
		function callback(dataUrl) {
			uploadProfileImageByDataUrl(dataUrl).then((downloadUrl) => {
				dispatch(profileActions.changeMyProfileImage(downloadUrl));
			});
		}
		getImageDataUrl(event, callback);
	};

	return (
		<div className={classes.myProfile} onClick={onProfileClick}>
			<div className={classes.profileImage}>
				{myProfile.image && <img src={myProfile.image} alt="profile" />}
				<div className={classes.cameraBtnOuter}>
					<label htmlFor="change-profile-image" className={classes.cameraBtn}>
						<i className="fas fa-camera-retro" />
					</label>
					<input
						id="change-profile-image"
						type="file"
						className={classes.imageInput}
						onChange={onProfileImageChange}
					/>
				</div>
			</div>
			<div className={classes.myNameContainer}>
				{myProfile.name && <h3 className={classes.myName}>{myProfile.name}</h3>}
				<i className="fas fa-edit" />
			</div>
			<p className={classes.myEmail}>{getMyEmail() ?? "-"}</p>
			<div className={classes.signoutBtnContainer}>
				<button className={classes.signoutBtn} onClick={onSignOutClick}>
					로그아웃
				</button>
			</div>
		</div>
	);
};

export default MyProfile;
