import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { isInbox } from "../../../Firebase/db";
import classes from "./index.module.css";

const LetterSheet = ({ style, onDownload, children }) => {
	const history = useHistory();
	const { letter } = useParams();

	const user = useSelector((state) => state.auth.user);

	const [isLetterInbox, setIsLetterInbox] = useState(null);

	useEffect(() => {
		if (user) {
			isInbox(letter).then((exists) => setIsLetterInbox(exists));
		}
	}, [user, letter]);

	const onGoBackClick = () => history.push(user ? "/inbox" : "/");

	const onDownloadClick = () => {
		if (user) {
			onDownload();
		} else {
			console.log("need to login");
		}
	};

	const showDownloadButton = !user || isLetterInbox === false;

	return (
		<>
			<div className={classes.controls}>
				<button onClick={onGoBackClick}>
					{user ? (
						<i className="fas fa-times" />
					) : (
						<i className="fas fa-home" />
					)}
				</button>
				{showDownloadButton && (
					<button onClick={onDownloadClick}>
						<i className="fas fa-download" />
					</button>
				)}
			</div>
			<div className={classes.backdrop} />
			<div className={classes.letterSheet} style={style}>
				{children}
			</div>
		</>
	);
};

export default LetterSheet;
