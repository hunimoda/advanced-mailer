import classes from "./index.module.css";

const MainLogo = () => {
	return (
		<div className={classes.mainLogo}>
			<i
				className="fab fa-mailchimp"
				style={{
					color: "#f5850e",
					fontSize: "30px",
				}}
			/>
			<h1 className={classes.appTitle}>Mailer</h1>
		</div>
	);
};

export default MainLogo;
