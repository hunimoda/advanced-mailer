import { useState, useEffect } from "react";
import { getProfileByUid } from "../../Helper/profile";
import classes from "./index.module.css";

const LetterPreview = ({ metaData }) => {
	const { summary, writerUid } = metaData;

	const [profile, setProfile] = useState(null);

	useEffect(
		() => getProfileByUid(writerUid).then((profile) => setProfile(profile)),
		[writerUid]
	);

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
