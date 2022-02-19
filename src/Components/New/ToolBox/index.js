import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import {
	letterActions,
	addImageObjectBySrc,
	setSheetBgImageResize,
} from "../../../Context/letter";
import classes from "./index.module.css";

const ToolBox = () => {
	const dispatch = useDispatch();

	const textareaRef = useRef();
	const [showTextInput, setShowTextInput] = useState(false);

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

	return (
		<>
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
		</>
	);
};

export default ToolBox;
