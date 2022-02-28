import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addImageObjectBySrc } from "../../../../Context/letter";
import { getGifDesigns, getStickerDesigns } from "../../../../Firebase/db";
import {
	letterActions,
	setSheetBgImageResize,
} from "../../../../Context/letter";
import classes from "./index.module.css";
import Img from "../../../../UI/Img";

const StickersList = ({ onSelect }) => {
	const dispatch = useDispatch();

	const [gifUrls, setGifUrls] = useState([]);
	const [stickerUrls, setStickerUrls] = useState([]);
	const [showGifs, setShowGifs] = useState(true);

	const buttonsClassName =
		classes.imageType + (showGifs ? " " + classes.gifs : "");

	const onAddImageClick = (event) => {
		dispatch(addImageObjectBySrc(event.currentTarget.src));
		onSelect();
	};

	useEffect(() => {
		getGifDesigns().then((urls) => setGifUrls(urls));
		getStickerDesigns().then((urls) => setStickerUrls(urls));
	}, []);

	return (
		<>
			<div className={buttonsClassName}>
				<button onClick={() => setShowGifs(true)}>
					<i className="fas fa-play-circle" />
				</button>
				<button onClick={() => setShowGifs(false)}>
					<i className="fas fa-laugh-beam" />
				</button>
			</div>
			<ul className={classes.stickersList}>
				{(showGifs ? gifUrls : stickerUrls).map((url) => (
					<li key={url}>
						<Img src={url} alt="" onClick={onAddImageClick} />
					</li>
				))}
			</ul>
		</>
	);
};

export default StickersList;
