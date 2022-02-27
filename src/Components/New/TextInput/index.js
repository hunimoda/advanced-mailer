import { useEffect, useRef } from "react";
import classes from "./index.module.css";

const TextInput = (props) => {
	const textareaRef = useRef();

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
			props.onConfirm(inputString);
		}
	};

	useEffect(() => {
		const textLength = textareaRef.current.value.length;

		textareaRef.current.setSelectionRange(textLength, textLength);
	}, []);

	return (
		<div className={classes.inputBackdrop} onClick={onInputBackdropClick}>
			<div className={classes.controls}>
				<button onClick={props.onCancel} className={classes.cancelBtn}>
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
					defaultValue={props.defaultValue}
					autoFocus
				></textarea>
			</div>
		</div>
	);
};

export default TextInput;
