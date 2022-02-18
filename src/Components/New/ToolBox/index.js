import { useDispatch } from "react-redux";
import { letterActions } from "../../../Context/letter";
import classes from "./index.module.css";

const ToolBox = ({ onAddGalleryImage, onAddSheetBgImage, aspectRatio }) => {
	const dispatch = useDispatch();

	const onChangeAspectRatioClick = () =>
		dispatch(letterActions.resizeSheet(Number(window.prompt("종횡비"))));

	const onChangeSheetColor = (event) =>
		dispatch(letterActions.setSheetBgColor(event.target.value));

	const onAddTextClick = () => dispatch({ type: "ADD_TEXT" });

	const onAddImageClick = () =>
		dispatch({
			type: "ADD_IMAGE",
			payload: {
				src: "	https://place-hold.it/300x500",
				imageRatio: 0.6,
				sheetRatio: aspectRatio,
			},
		});

	const onAddGalleryImageChange = (event) => {
		const {
			target: { files },
		} = event;
		const file = files[0];
		const reader = new FileReader();

		reader.onloadend = (readerEvent) =>
			onAddGalleryImage(readerEvent.currentTarget.result);
		reader.readAsDataURL(file);
	};

	const onAddSheetBgImageChange = (event) => {
		const {
			target: { files },
		} = event;
		const file = files[0];
		const reader = new FileReader();

		reader.onloadend = (readerEvent) =>
			onAddSheetBgImage(readerEvent.currentTarget.result);
		reader.readAsDataURL(file);
	};

	return (
		<footer className={classes.footer}>
			<div className={classes.toolbox}>
				<label className={classes.button} htmlFor="addSheetBgImage">
					Bg
				</label>
				<input
					id="addSheetBgImage"
					type="file"
					accept="image/*"
					onChange={onAddSheetBgImageChange}
				/>
				<button className={classes.button} onClick={onChangeAspectRatioClick}>
					{aspectRatio.toFixed(2)}
				</button>
				<label className={classes.button} htmlFor="changeSheetColor">
					C
				</label>
				<input
					id="changeSheetColor"
					type="color"
					onChange={onChangeSheetColor}
				/>
				<button className={classes.button} onClick={onAddTextClick}>
					+T
				</button>
				<button className={classes.button} onClick={onAddImageClick}>
					+Img
				</button>
				<label className={classes.button} htmlFor="addGalleryImage">
					Gal
				</label>
				<input
					id="addGalleryImage"
					type="file"
					accept="image/*"
					onChange={onAddGalleryImageChange}
				/>
				<button className={classes.button}>
					<i className="fas fa-times" />
				</button>
				<button className={classes.button}>
					<i className="fas fa-times" />
				</button>
				<button className={classes.button}>
					<i className="fas fa-times" />
				</button>
			</div>
		</footer>
	);
};

export default ToolBox;
