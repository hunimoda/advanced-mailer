import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { profileActions } from "../../Context/profile";
import { signOut } from "../../Context/auth";
import { getMyEmail, getMyUid } from "../../Firebase/auth";
import { uploadProfileImageByDataUrl } from "../../Firebase/storage";
import { saveProfileImage, saveProfileName } from "../../Firebase/db";
import LoadingSpinner from "../../UI/LoadingSpinner";
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

	const [profileName, setProfileName] = useState(myProfile.name);
	const [isLoading, setIsLoading] = useState(false);

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
		async function callback(dataUrl) {
			setIsLoading(true);
			dispatch(profileActions.changeMyProfileImage(dataUrl));

			const downloadUrl = await uploadProfileImageByDataUrl(dataUrl);

			await saveProfileImage(downloadUrl);

			dispatch(profileActions.changeMyProfileImage(downloadUrl));
		}

		getImageDataUrl(event, callback);
	};

	const onProfileImageLoad = (event) => {
		if (!event.target.src.startsWith("data:")) {
			setIsLoading(false);
		}
	};

	const onProfileNameChange = (event) => {
		const nameValue = event.target.value;

		if (nameValue.length < 8) {
			setProfileName(nameValue);
		}
	};

	const onProfileNameSave = (event) => {
		const name = event.target.value;

		if (name !== myProfile.name) {
			saveProfileName(name);
			dispatch(profileActions.changeMyProfileName(name));
		}
	};

	return (
		<div className={classes.myProfile} onClick={onProfileClick}>
			<div className={classes.profileImage}>
				{isLoading && <LoadingSpinner className={classes.loader} />}
				{myProfile.image && (
					<img
						src={myProfile.image}
						className={isLoading ? classes.darken : ""}
						alt="profile"
						onLoad={onProfileImageLoad}
					/>
				)}
				<div className={classes.cameraBtnOuter}>
					<label htmlFor="change-profile-image" className={classes.cameraBtn}>
						<i className="fas fa-camera-retro" />
					</label>
					<input
						id="change-profile-image"
						type="file"
						accept="image/*"
						className={classes.imageInput}
						onChange={onProfileImageChange}
					/>
				</div>
			</div>
			<input
				className={classes.myName}
				value={profileName}
				onChange={onProfileNameChange}
				onBlur={onProfileNameSave}
				id="profile-name"
			/>
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
