import { useDispatch } from "react-redux";
import {
	letterActions,
	addImageObjectBySrc,
	setSheetBgImageResize,
} from "../../../Context/letter";
import classes from "./index.module.css";

const ToolBox = () => {
	const dispatch = useDispatch();

	const dispatchImageAction = (event, callback) => {
		const {
			target: { files },
		} = event;
		const file = files[0];
		const reader = new FileReader();

		reader.onloadend = (readerEvent) =>
			dispatch(callback(readerEvent.currentTarget.result));
		reader.readAsDataURL(file);
	};

	const onAddSheetBgImageChange = (event) =>
		dispatchImageAction(event, setSheetBgImageResize);

	const onResizeSheetClick = () =>
		dispatch(letterActions.resizeSheet(Number(window.prompt("종횡비"))));

	const onSheetColorChange = (event) =>
		dispatch(letterActions.setSheetBgColor(event.target.value));

	const onAddTextClick = () =>
		dispatch(letterActions.addTextObject("Hello World"));

	const onAddImageClick = () =>
		dispatch(addImageObjectBySrc("https://place-hold.it/300x500"));

	const onAddGalleryImageChange = (event) =>
		dispatchImageAction(event, addImageObjectBySrc);

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
				<button className={classes.button} onClick={onResizeSheetClick}>
					AR
				</button>
				<label className={classes.button} htmlFor="changeSheetColor">
					C
				</label>
				<input
					id="changeSheetColor"
					type="color"
					onChange={onSheetColorChange}
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
