import classes from "./index.module.css";

const LetterPreview = ({ description }) => {
	return (
		<>
			<img
				src="https://place-hold.it/300x500"
				alt="placeholder"
				className={classes.thumbnail}
			/>
			<p className={classes.message}>{description.summary}</p>
			<div className={classes.itemRow}>
				<div className={classes.sender}>
					<img src="https://place-hold.it/300x500" alt="profile" />
					<h4>보물 1호</h4>
				</div>
				<span className={classes.timestamp}>2022.01.26 18:32:06</span>
			</div>
		</>
	);
};

export default LetterPreview;
