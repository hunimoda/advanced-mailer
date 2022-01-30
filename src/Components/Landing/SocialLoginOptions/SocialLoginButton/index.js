import classes from "./index.module.css";

const SocialLoginButton = (props) => {
	const { className, onClick, icon: iconClassName, value } = props;
	const buttonClassName = `${classes.socialLoginBtn} ${className}`;

	return (
		<button onClick={onClick} className={buttonClassName}>
			<span>
				<i className={iconClassName} />
			</span>
			<span>{value}</span>
		</button>
	);
};

export default SocialLoginButton;
