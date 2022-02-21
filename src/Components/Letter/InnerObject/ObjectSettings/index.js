import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { letterActions } from "../../../../Context/letter";
import Modal from "../../../../UI/Modal";
import InnerObject from "..";
import SettingItem from "./SettingItem";
import classes from "./index.module.css";

const SUPPORTED_FONTS = [
	"Arial",
	"Arial Black",
	"Verdana",
	"Tahoma",
	"Trebuchet MS",
	"Impact",
	"Times New Roman",
	"Didot",
	"Georgia",
	"American Typewriter",
	"Andalé Mono",
];

const ObjectSettings = ({ id, onClose, style }) => {
	const dispatch = useDispatch();
	const sheetSize = useSelector((state) => state.letter.sheet.size);

	const [previewStyle, setPreviewStyle] = useState(style);

	const onSettingsChange = (event) => {
		setPreviewStyle((prevStyle) => {
			const newStyle = JSON.parse(JSON.stringify(prevStyle));
			const {
				dataset: { property },
				value,
			} = event.target;

			const complexPropMatch = property.match(/([a-z]+)\.([a-z]+)/i);

			if (complexPropMatch) {
				newStyle[complexPropMatch[1]][complexPropMatch[2]] = value;
			} else {
				newStyle[property] = value;
			}

			return newStyle;
		});
	};

	const onApplySettingsClick = () => {
		dispatch(letterActions.setAllStyleAtOnce({ id, style: previewStyle }));
		onClose();
	};

	console.log(previewStyle);
	return (
		<Modal
			className={classes.objectSettings}
			backdropColor="rgba(0, 0, 0, 0.6)"
		>
			<div
				className={classes.previewContainer}
				style={{ height: style.height * sheetSize.height }}
			>
				<div
					className={classes.preview}
					style={{
						width: style.width * sheetSize.width,
						height: style.height * sheetSize.height,
					}}
				>
					<InnerObject
						id={id}
						sheetSize={sheetSize}
						forcedStyle={{
							...previewStyle,
							top: 0,
							left: 0,
							transform: { scale: previewStyle.transform.scale },
						}}
						readOnly={true}
					/>
				</div>
			</div>
			<ul className={classes.settingsList}>
				<SettingItem
					title="글자 색"
					type="color"
					initValue={previewStyle.color}
					property="color"
					onChange={onSettingsChange}
				/>
				<SettingItem
					title="폰트"
					type="select"
					options={SUPPORTED_FONTS}
					initValue={previewStyle.fontFamily}
					property="fontFamily"
					onChange={onSettingsChange}
				/>
				<SettingItem
					title="글자 크기"
					type="range"
					initValue={previewStyle.transform.scale}
					property="transform.scale"
					onChange={onSettingsChange}
					min="0.02"
					max="0.1"
					step="0.001"
				/>
				<SettingItem
					title="배경 색"
					type="color"
					initValue={previewStyle.backgroundColor}
					property="backgroundColor"
					onChange={onSettingsChange}
				/>
				<SettingItem
					title="그림자 색"
					type="color"
					initValue={previewStyle.textShadow.color}
					property="textShadow.color"
					onChange={onSettingsChange}
				/>
				<SettingItem
					title="그림자 크기"
					type="range"
					initValue={previewStyle.textShadow.size}
					property="textShadow.size"
					onChange={onSettingsChange}
					min="0"
					max="0.3"
					step="0.01"
				/>
				<SettingItem
					title="테두리 색"
					type="color"
					initValue={previewStyle.border.color}
					property="border.color"
					onChange={onSettingsChange}
				/>
				<SettingItem
					title="테두리 두께"
					type="range"
					initValue={previewStyle.border.width}
					property="border.width"
					onChange={onSettingsChange}
					min="0.00"
					max="0.05"
					step="0.001"
				/>
				<li>선 간격</li>
				<li>여백</li>
				<li>정렬</li>
			</ul>
			<footer>
				<button onClick={onClose}>취소</button>
				<button onClick={onApplySettingsClick}>적용</button>
			</footer>
		</Modal>
	);
};

export default ObjectSettings;
