import { useState, useEffect } from "react";
import { getProfileByUid } from "../../Helper/profile";
import classes from "./index.module.css";

const LetterPreview = ({ metaData, onClick }) => {
	const { previewImageUrl, summary, writerUid, createdAt } = metaData;

	const [profile, setProfile] = useState(null);

	useEffect(
		() => getProfileByUid(writerUid).then((profile) => setProfile(profile)),
		[writerUid]
	);

	const createdAtFormatted = new Date(createdAt)
		.toISOString()
		.substr(0, 19)
		.replace("T", " ");

	return (
		<>
			<img
				src={previewImageUrl}
				alt="placeholder"
				className={classes.thumbnail}
				onClick={onClick}
			/>
			<p className={classes.message} onClick={onClick}>
				{summary}
			</p>
			<div className={classes.itemRow}>
				{profile && (
					<div className={classes.sender}>
						<img src={profile.image} alt="profile" />
						<h4>{profile.name}</h4>
					</div>
				)}
				<span className={classes.timestamp}>{createdAtFormatted}</span>
			</div>
		</>
	);
};

export default LetterPreview;
