import { useState } from "react";
import LoadingSpinner from "../LoadingSpinner";

const Img = (props) => {
	const [loaded, setLoaded] = useState(false);

	return (
		<>
			{!loaded && <LoadingSpinner className={props.loaderClassName} />}
			<img
				{...props}
				alt={props.alt}
				onLoad={() => setLoaded(true)}
				style={loaded ? {} : { display: "none" }}
			/>
		</>
	);
};

export default Img;
