import { useState } from "react";
import LoadingSpinner from "../LoadingSpinner";

const Img = ({ src, alt, className, loaderClassName, onClick }) => {
	const [loaded, setLoaded] = useState(false);

	return (
		<>
			{!loaded && <LoadingSpinner className={loaderClassName} />}
			<img
				src={src}
				alt={alt}
				className={className}
				onClick={onClick}
				onLoad={() => setLoaded(true)}
				style={loaded ? {} : { display: "none" }}
			/>
		</>
	);
};

export default Img;
