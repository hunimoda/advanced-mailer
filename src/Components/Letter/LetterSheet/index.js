import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { isInbox, saveLetterToInbox } from "../../../Firebase/db";
import classes from "./index.module.css";

const LetterSheet = ({ style, description, children }) => {
	const history = useHistory();
	const { letter } = useParams();

	const user = useSelector((state) => state.auth.user);

	const [isLetterInbox, setIsLetterInbox] = useState(null);

	useEffect(() => {
		if (user) {
			isInbox(letter).then((exists) => setIsLetterInbox(exists));
		}
	}, [user, letter]);

	const onGoBackClick = () => {
		const { pathname } = window.location;

		if (pathname.startsWith("/sent")) {
			history.push("/sent");
		} else if (pathname.startsWith("/inbox")) {
			history.push("/inbox");
		} else {
			history.push("/");
		}
	};

	const onDownloadClick = () => {
		if (user) {
			saveLetterToInbox(letter, description).then(() => {
				alert("added to inbox");
				setIsLetterInbox(true);
			});
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
