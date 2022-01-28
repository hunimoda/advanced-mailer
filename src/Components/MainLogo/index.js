import { Link } from "react-router-dom";
import classes from "./index.module.css";

const MainLogo = () => {
	return (
		<Link to="/" className={classes.mainLogo}>
			<i
				className="fab fa-mailchimp"
				style={{
					color: "#f5850e",
					fontSize: "30px",
				}}
			/>
			<h2 className={classes.appTitle}>Mailer</h2>
		</Link>
	);
};

export default MainLogo;
