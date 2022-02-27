import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../UI/Modal";
import {
	letterActions,
	addImageObjectBySrc,
	setSheetBgImageResize,
} from "../../../Context/letter";
import SheetBgList from "./SheetBgList";
import classes from "./index.module.css";
import SheetAspectRatio from "./SheetAspectRatio";

const ToolBox = () => {
	const dispatch = useDispatch();
	const backgroundImage = useSelector(
		(state) => state.letter.sheet.backgroundImage
	);

	const textareaRef = useRef();
	const [showTextInput, setShowTextInput] = useState(false);
	const [menuPopup, setMenuPopup] = useState(null);
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

	const onAddImageClick = () =>
		dispatch(addImageObjectBySrc("https://place-hold.it/300x500"));

	const onAddGalleryImageChange = (event) =>
		dispatchImageAction(event, addImageObjectBySrc);

	const onInputBackdropClick = () => textareaRef.current.focus();

	const onTextAreaChange = (event) => {
		const { target } = event;

		target.style.height = "0px";
		target.style.height = `${target.scrollHeight}px`;
	};

	const onCancel = () => setShowTextInput(false);

	const onConfirm = () => {
		const inputString = textareaRef.current.value;

		if (inputString.trim().length === 0) {
			alert("빈 문자열 입력");
		} else {
			dispatch(letterActions.addTextObject(inputString));
			setShowTextInput(false);
		}
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
			{showTextInput && (
				<div className={classes.inputBackdrop} onClick={onInputBackdropClick}>
					<div className={classes.controls}>
						<button onClick={onCancel} className={classes.cancelBtn}>
							취소
						</button>
						<button onClick={onConfirm} className={classes.confirmBtn}>
							입력
						</button>
					</div>
					<div className={classes.textareaContainer}>
						<textarea
							ref={textareaRef}
							className={classes.textarea}
							onChange={onTextAreaChange}
							autoFocus
						></textarea>
					</div>
				</div>
			)}
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
					<button className={classes.button} onClick={onAddImageClick}>
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
				</div>
			</footer>
		</>
	);
};

export default ToolBox;
