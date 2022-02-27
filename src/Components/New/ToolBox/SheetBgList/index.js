import { useEffect, useState } from "react";
import { getSheetDesigns } from "../../../../Firebase/db";
import classes from "./index.module.css";

const SheetBgList = () => {
	const [imageUrls, setImageUrls] = useState([]);

	useEffect(
		() => getSheetDesigns().then((imageUrls) => setImageUrls(imageUrls)),
		[]
	);

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
				/>
			</li>
			{imageUrls.map((imageUrl) => (
				<li key={imageUrl}>
					<img src={imageUrl} alt="" />
				</li>
			))}
		</ul>
	);
};

export default SheetBgList;
