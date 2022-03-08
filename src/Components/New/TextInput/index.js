import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { createPortal } from "react-dom";
import { letterActions } from "../../../Context/letter";
import { getObjectById } from "../../Letter/InnerObject/helper";
import classes from "./index.module.css";

const TextInput = ({ id, onClose }) => {
	const textareaRef = useRef();
	const dispatch = useDispatch();

	const defaultValue = getObjectById(id)?.value;

	const onInputBackdropClick = () => textareaRef.current.focus();

	const onTextAreaChange = (event) => {
		const { target } = event;

		target.style.height = "0px";
		target.style.height = `${target.scrollHeight}px`;
	};

	const onConfirm = () => {
		const inputString = textareaRef.current.value;

		if (inputString.trim().length === 0) {
			alert("빈 문자열 입력");
		} else {
			if (id) {
				dispatch(letterActions.editText({ id, value: inputString }));
			} else {
				dispatch(letterActions.addTextObject(inputString));
			}
			onClose();
		}
	};

	useEffect(() => {
		const textLength = textareaRef.current.value.length;

		textareaRef.current.setSelectionRange(textLength, textLength);
	}, []);

	return createPortal(
		<div className={classes.inputBackdrop} onClick={onInputBackdropClick}>
			<div className={classes.controls}>
				<button onClick={onClose} className={classes.cancelBtn}>
					취소
				</button>
				<button onClick={onConfirm} className={classes.confirmBtn}>
					{defaultValue ? "수정" : "입력"}
				</button>
			</div>
			<div className={classes.textareaContainer}>
				<textarea
					ref={textareaRef}
					className={classes.textarea}
					onChange={onTextAreaChange}
					defaultValue={defaultValue}
					autoFocus
				></textarea>
			</div>
		</div>,
		document.getElementById("input-root")
	);
};

export default TextInput;
