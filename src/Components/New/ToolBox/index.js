import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../UI/Modal";
import {
	letterActions,
	addImageObjectBySrc,
	setSheetBgImageResize,
} from "../../../Context/letter";
import SheetBgList from "./SheetBgList";
import SheetAspectRatio from "./SheetAspectRatio";
import TextInput from "../TextInput";
import classes from "./index.module.css";
import StickersList from "./StickersList";
import Canvas from "./Canvas";

const ToolBox = () => {
	const dispatch = useDispatch();
	const backgroundImage = useSelector(
		(state) => state.letter.sheet.backgroundImage
	);

	const [showTextInput, setShowTextInput] = useState(false);
	const [menuPopup, setMenuPopup] = useState(null);
	const [showCanvas, setShowCanvas] = useState(false);
	const [ratioString, setRatioString] = useState("3:4");

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

	const onAddTextClick = () => setShowTextInput(true);

	const onAddGalleryImageChange = (event) =>
		dispatchImageAction(event, addImageObjectBySrc);

	const onCancel = () => setShowTextInput(false);

	const onConfirm = (inputString) => {
		dispatch(letterActions.addTextObject(inputString));
		setShowTextInput(false);
	};

	const onShowMenuPopup = (event) => {
		const type = event.currentTarget.dataset.type;

		if (type === "sheet-background") {
			setMenuPopup({
				title: "편지지",
				jsx: <SheetBgList onSelect={onMenuPopupClose} />,
			});
		} else if (type === "sheet-aspect-ratio") {
			if (!backgroundImage) {
				setMenuPopup({
					title: "종횡비",
					jsx: <SheetAspectRatio onRatioChange={onSheetRatioChange} />,
				});
			} else {
				alert("편지지의 비율이 배경 사진에 맞추어져 있습니다.");
			}
		} else if (type === "gifs-and-stickers") {
			setMenuPopup({
				title: "스티커",
				jsx: <StickersList onSelect={onMenuPopupClose} />,
			});
		}
	};

	const onMenuPopupClose = () => setMenuPopup(null);

	const onSheetRatioChange = (ratioString) => setRatioString(ratioString);

	return (
		<>
			{menuPopup && (
				<Modal className={classes.menuPopup} onClose={onMenuPopupClose}>
					<header>
						<h3>{menuPopup.title}</h3>
						<button onClick={onMenuPopupClose} className={classes.closeButton}>
							닫기
						</button>
					</header>
					<main>{menuPopup.jsx}</main>
					{menuPopup.message && <footer>{menuPopup.message}</footer>}
				</Modal>
			)}
			{showTextInput && <TextInput onCancel={onCancel} onConfirm={onConfirm} />}
			{showCanvas && <Canvas />}
			<footer className={classes.footer}>
				<div className={classes.toolbox}>
					<button
						className={classes.button}
						onClick={onShowMenuPopup}
						data-type="sheet-background"
					>
						<i className={`fas fa-map ${classes.letterSheetIcon}`} />
					</button>
					<button
						className={classes.button}
						onClick={onShowMenuPopup}
						data-type="sheet-aspect-ratio"
					>
						{backgroundImage ? (
							<i className="fas fa-vector-square" />
						) : (
							ratioString
						)}
					</button>
					<label className={classes.button} htmlFor="changeSheetColor">
						<i className="fas fa-fill-drip" />
					</label>
					<input
						id="changeSheetColor"
						type="color"
						onChange={onSheetColorChange}
					/>
					<button className={classes.button} onClick={onAddTextClick}>
						<span className={classes.addTextIcon}>T</span>
					</button>
					<button
						className={classes.button}
						onClick={onShowMenuPopup}
						data-type="gifs-and-stickers"
					>
						<i className="fas fa-icons" />
					</button>
					<label className={classes.button} htmlFor="addGalleryImage">
						<i className="fas fa-image" />
					</label>
					<input
						id="addGalleryImage"
						type="file"
						accept="image/*"
						onChange={onAddGalleryImageChange}
					/>
					<button
						className={classes.button}
						onClick={() => setShowCanvas(true)}
					>
						<i className="fas fa-pen-nib" />
					</button>
				</div>
			</footer>
		</>
	);
};

export default ToolBox;
