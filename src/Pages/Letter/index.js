import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getLetter } from "../../Firebase/db";

const Letter = () => {
	const { sender, letter } = useParams();

	useEffect(() => {
		getLetter(sender, letter).then((data) => {
			if (data) {
				console.log(data);
			}
		});
	}, [sender, letter]);

	return <p>{`sender: ${sender}, letter: ${letter}`}</p>;
};

export default Letter;
