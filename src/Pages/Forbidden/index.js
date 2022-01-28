import { useHistory, useLocation } from "react-router-dom";

const Forbidden = () => {
	const history = useHistory();
	const location = useLocation();

	const onRedirect = () => {
		const { pathname } = location;

		window.localStorage.setItem("returnPath", pathname);
		history.replace("/");
	};

	return (
		<>
			<div
				style={{
					background: "rgba(0, 0, 0, 0.5)",
					position: "fixed",
					top: "0px",
					left: "0px",
					right: "0px",
					bottom: "0px",
					zIndex: 1,
				}}
			/>
			<div
				style={{
					background: "white",
					width: "80vw",
					position: "fixed",
					zIndex: 2,
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
				}}
			>
				<p style={{ lineHeight: "50px", textAlign: "center" }}>
					Redirecting...
				</p>
				<button
					style={{ width: "50px", display: "block", margin: "0 auto 20px" }}
					onClick={onRedirect}
				>
					OK
				</button>
			</div>
		</>
	);
};

export default Forbidden;
