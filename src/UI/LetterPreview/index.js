import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { profileActions } from "../../Context/profile";
import { getProfile } from "../../Firebase/db";
import classes from "./index.module.css";

const LetterPreview = ({ description }) => {
	const { summary, writerUid } = description;

	const [profile, setProfile] = useState(null);

	const dispatch = useDispatch();
	const profiles = useSelector((state) => state.profile);

	useEffect(() => {
		(async () => {
			let profile = profiles[writerUid];

			if (!profile) {
				profile = await getProfile(writerUid);
				dispatch(profileActions.addNewProfile({ uid: writerUid, profile }));
			}

			setProfile(profile);
		})();
	}, [profiles, writerUid, dispatch]);

	return (
		<>
			<img
				src="https://place-hold.it/300x500"
				alt="placeholder"
				className={classes.thumbnail}
			/>
			<p className={classes.message}>{summary}</p>
			<div className={classes.itemRow}>
				{profile && (
					<div className={classes.sender}>
						<img src={profile.image} alt="profile" />
						<h4>{profile.name}</h4>
					</div>
				)}
				<span className={classes.timestamp}>2022.01.26 18:32:06</span>
			</div>
		</>
	);
};

export default LetterPreview;
