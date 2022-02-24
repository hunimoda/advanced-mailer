import { useState, useRef, useEffect } from "react";
import InnerObject from "../../Components/Letter/InnerObject";
import Sheet from "../../Components/Sheet";
import { getProfileByUid } from "../../Helper/profile";
import classes from "./index.module.css";

const getSummaryFromLetterObjects = (objects) => {
	const CUT_LENGTH = 50;
	let summary = "";

	for (const id of Object.keys(objects).sort()) {
		if (objects[id].type === "text") {
			summary += ` ${objects[id].value}`;
		}
	}

	summary = summary.replace(/\s+/g, " ").trim();

	if (summary.length > CUT_LENGTH) {
		summary = summary.slice(0, CUT_LENGTH).trim() + "...";
	}

	return summary;
};

const LetterPreview = ({ letter: { metaData, letter }, onClick }) => {
	const { writerUid, createdAt } = metaData;
	const summary = getSummaryFromLetterObjects(letter.objects);

	const [profile, setProfile] = useState(null);
	const [sheetWidth, setSheetWidth] = useState(null);

	const thumbnailRef = useRef();

	useEffect(
		() => getProfileByUid(writerUid).then((profile) => setProfile(profile)),
		[writerUid]
	);

	useEffect(() => {
		setSheetWidth(thumbnailRef.current.offsetWidth);
	}, []);

	const createdAtFormatted = new Date(createdAt)
		.toISOString()
		.substr(0, 19)
		.replace("T", " ");

	return (
		<>
			<div className={classes.thumbnail} ref={thumbnailRef}>
				{sheetWidth && (
					<Sheet
						className={classes.innerShadow}
						sheet={{
							size: {
								width: sheetWidth,
								height: sheetWidth / letter.sheet.aspectRatio,
							},
							aspectRatio: letter.sheet.aspectRatio,
							backgroundColor: letter.sheet.backgroundColor,
							backgroundImage: letter.sheet.backgroundImage,
						}}
					>
						{Object.entries(letter.objects).map(([id, object]) => (
							<InnerObject
								key={id}
								id={id}
								sheetSize={{
									width: sheetWidth,
									height: sheetWidth / letter.sheet.aspectRatio,
								}}
								object={object}
								readOnly={true}
							/>
						))}
					</Sheet>
				)}
			</div>
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
