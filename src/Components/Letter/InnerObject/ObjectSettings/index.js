import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { letterActions } from "../../../../Context/letter";
import Modal from "../../../../UI/Modal";
import InnerObject from "..";
import Group from "./Group";
import classes from "./index.module.css";

const ObjectSettings = ({ id, onClose, style }) => {
	const dispatch = useDispatch();
	const sheetSize = useSelector((state) => state.letter.sheet.size);

	const [previewStyle, setPreviewStyle] = useState(style);

	const onSettingsChange = (event) => {
		setPreviewStyle((style) => {
			const newStyle = JSON.parse(JSON.stringify(style));
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
				<li className={classes.settingItem}>
					<h4 className={classes.settingProperty}>글자 색</h4>
					<label
						htmlFor="text-color"
						className={`${classes.settingValue} ${classes.colorBtn}`}
						style={{ backgroundColor: previewStyle.color }}
					></label>
					<input
						id="text-color"
						data-property="color"
						type="color"
						className={classes.hidden}
						onChange={onSettingsChange}
					/>
				</li>
				<li className={classes.settingItem}>
					<h4 className={classes.settingProperty}>폰트</h4>
					<select
						className={classes.settingValue}
						data-property="fontFamily"
						onChange={onSettingsChange}
					>
						<option value="Arial">Arial</option>
						<option value="Arial Black">Arial Black</option>
						<option value="Verdana">Verdana</option>
						<option value="Tahoma">Tahoma</option>
						<option value="Trebuchet MS">Trebuchet MS</option>
						<option value="Impact">Impact</option>
						<option value="Times New Roman">Times New Roman</option>
						<option value="Didot">Didot</option>
						<option value="Georgia">Georgia</option>
						<option value="American Typewriter">American Typewriter</option>
						<option value="Andale Mono">Andale Mono</option>
					</select>
				</li>
				<li className={classes.settingItem}>
					<h4 className={classes.settingProperty}>크기</h4>
					<input
						data-property="transform.scale"
						type="range"
						min="0.005"
						max="0.1"
						step="0.005"
						className={classes.settingValue}
						onChange={onSettingsChange}
					/>
				</li>
				<li className={classes.settingItem}>
					<h4 className={classes.settingProperty}>배경 색</h4>
					<label
						htmlFor="text-bg-color"
						className={`${classes.settingValue} ${classes.colorBtn}`}
						style={{ backgroundColor: previewStyle.backgroundColor }}
					></label>
					<input
						id="text-bg-color"
						data-property="backgroundColor"
						type="color"
						className={classes.hidden}
						onChange={onSettingsChange}
					/>
				</li>
				<li className={classes.groupSettingItem}>
					<h4 className={classes.groupSettingProperty}>그림자</h4>
					<Group
						value={previewStyle.textShadow}
						format="0px 0px {1}px {2}"
						onChange={onSettingsChange}
						property="textShadow"
					>
						<li className={classes.settingItem}>
							<h4 className={classes.settingProperty}>그림자 색</h4>
							<label
								htmlFor="text-shadow-color"
								className={`${classes.settingValue} ${classes.colorBtn}`}
								// style={{ backgroundColor: previewStyle.backgroundColor }}
							></label>
							<input
								id="text-shadow-color"
								data-index="2"
								type="color"
								className={classes.hidden}
								// onChange={onSettingsChange}
							/>
						</li>
						<li className={classes.settingItem}>
							<h4 className={classes.settingProperty}>그림자 크기</h4>
							<input
								data-index="1"
								type="range"
								min="0"
								max="10"
								step="1"
								className={classes.settingValue}
								data-multiplier={1 / previewStyle.transform.scale}
								// onChange={onSettingsChange}
							/>
						</li>
					</Group>
				</li>
				<li>선 간격</li>
				<li className={classes.groupSettingItem}>
					<h4 className={classes.groupSettingProperty}>테두리</h4>
					<ul>
						<li className={classes.settingItem}>
							<h4 className={classes.settingProperty}>색</h4>
							<label
								htmlFor="border-color"
								className={`${classes.settingValue} ${classes.colorBtn}`}
								style={{ backgroundColor: previewStyle.border.color }}
							></label>
							<input
								id="border-color"
								type="color"
								className={classes.hidden}
								data-property="border.color"
								onChange={onSettingsChange}
							/>
						</li>
						<li className={classes.settingItem}>
							<h4 className={classes.settingProperty}>두께</h4>
							<input
								type="range"
								min="0"
								max="10"
								step="1"
								className={classes.settingValue}
								// onChange={onSettingsChange}
							/>
						</li>
					</ul>
				</li>
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
