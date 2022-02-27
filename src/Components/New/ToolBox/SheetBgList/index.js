import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getSheetDesigns } from "../../../../Firebase/db";
import { setSheetBgImageResize } from "../../../../Context/letter";
import classes from "./index.module.css";

const SheetBgList = ({ onSelect }) => {
	const dispatch = useDispatch();
	const [imageUrls, setImageUrls] = useState([]);

	useEffect(
		() => getSheetDesigns().then((imageUrls) => setImageUrls(imageUrls)),
		[]
	);

	const dispatchImageAction = (event, callback) => {
		const {
			target: { files },
		} = event;
		const file = files[0];
		const reader = new FileReader();

		reader.onloadend = (readerEvent) =>
			callback(readerEvent.currentTarget.result);
		reader.readAsDataURL(file);
	};

	function setSheetBgImage(dataUrl) {
		dispatch(setSheetBgImageResize(dataUrl));
		// onSelect();
	}

	const onAddBgImageFromGallery = (event) => {
		dispatchImageAction(event, setSheetBgImage);
	};

	return (
		<ul className={classes.sheetBgList}>
			<li>
				<label htmlFor="addSheetBgImage" className={classes.galleryButton}>
					<span>
						<i className="fas fa-images" />
					</span>
					<p>갤러리에서 추가</p>
				</label>
				<input
					id="addSheetBgImage"
					type="file"
					accept="image/*"
					className={classes.hidden}
					onChange={onAddBgImageFromGallery}
				/>
			</li>
			{imageUrls.map((imageUrl) => (
				<li key={imageUrl}>
					<img
						src={imageUrl}
						alt=""
						onClick={(event) => setSheetBgImage(event.target.src)}
					/>
				</li>
			))}
		</ul>
	);
};

export default SheetBgList;
