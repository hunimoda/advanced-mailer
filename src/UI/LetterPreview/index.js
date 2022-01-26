import classes from "./index.module.css";

const LetterPreview = () => {
	return (
		<>
			<img
				src="https://place-hold.it/300x500"
				alt="placeholder"
				className={classes.thumbnail}
			/>
			<p className={classes.message}>
				여자 혼자 사는 집에 '치킨 2마리+떡볶이 2인분+감튀' 배달 다녀온 라이더가
				한 막말
			</p>
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
