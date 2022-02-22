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
	const [settingsListClass, setSettingsListClass] = useState(
		`${classes.settingsList} ${classes.settingsListTop}`
	);

	const onSettingsListScroll = (event) => {
		const { offsetHeight, scrollTop, scrollHeight } = event.target;

		if (scrollTop === 0) {
			setSettingsListClass(classes["settingsList--top"]);
		} else if (offsetHeight + scrollTop >= scrollHeight) {
			setSettingsListClass(classes["settingsList--bottom"]);
		} else {
			setSettingsListClass("");
		}
	};

	const onSettingsChange = (event) => {
		setPreviewStyle((prevStyle) => {
			const newStyle = JSON.parse(JSON.stringify(prevStyle));
			const {
				dataset: { property },
				value,
			} = event.target;

			const typeCorrectedValue = isNaN(+value) ? value : +value;
			const complexPropMatch = property.match(/([a-z]+)\.([a-z]+)/i);
			let sizeChangeInPixels = null;

			if (complexPropMatch) {
				newStyle[complexPropMatch[1]][complexPropMatch[2]] = typeCorrectedValue;

				if (property === "border.width") {
					sizeChangeInPixels =
						(newStyle.border.width - prevStyle.border.width) * sheetSize.height;
				}
			} else {
				newStyle[property] = typeCorrectedValue;

				if (property === "padding") {
					sizeChangeInPixels =
						(newStyle.padding - prevStyle.padding) * sheetSize.height;
				}
			}

			if (property === "border.width" || property === "padding") {
				newStyle.width += (2 * sizeChangeInPixels) / sheetSize.width;
				newStyle.height += (2 * sizeChangeInPixels) / sheetSize.height;
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
				style={{ height: style.height * sheetSize.height + 2 }}
			>
				<div
					className={classes.preview}
					style={{
						width: style.width * sheetSize.width,
						height: style.height * sheetSize.height,
						border: "1px dotted #aaa",
						borderRadius:
							(Math.min(
								previewStyle.width * sheetSize.width,
								previewStyle.height * sheetSize.height
							) /
								2) *
							previewStyle.borderRadius,
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
			<ul
				className={`${settingsListClass} ${classes.settingsList}`}
				onScroll={onSettingsListScroll}
			>
				<div className={classes.group}>
					<h4>글꼴</h4>
					<SettingItem
						title="색상"
						type="color"
						initValue={previewStyle.color.rgb}
						property="color.rgb"
						onChange={onSettingsChange}
					/>
					<SettingItem
						title="투명도"
						type="range"
						initValue={previewStyle.color.transparency}
						property="color.transparency"
						onChange={onSettingsChange}
						min="0"
						max="1"
						step="0.01"
					/>
					<SettingItem
						title="모양"
						type="select"
						options={SUPPORTED_FONTS}
						initValue={previewStyle.fontFamily}
						property="fontFamily"
						onChange={onSettingsChange}
					/>
					<SettingItem
						title="크기"
						type="range"
						initValue={previewStyle.transform.scale}
						property="transform.scale"
						onChange={onSettingsChange}
						min="0.02"
						max="0.1"
						step="0.0008"
					/>
				</div>
				<div className={classes.group}>
					<h4>네온 효과</h4>
					<SettingItem
						title="색상"
						type="color"
						initValue={previewStyle.textShadow.color}
						property="textShadow.color"
						onChange={onSettingsChange}
					/>
					<SettingItem
						title="세기"
						type="range"
						initValue={previewStyle.textShadow.size}
						property="textShadow.size"
						onChange={onSettingsChange}
						min="0"
						max="0.3"
						step="0.003"
					/>
				</div>
				<div className={classes.group}>
					<h4>배경</h4>
					<SettingItem
						title="색상"
						type="color"
						initValue={previewStyle.backgroundColor}
						property="backgroundColor.rgb"
						onChange={onSettingsChange}
					/>
					<SettingItem
						title="투명도"
						type="range"
						initValue={previewStyle.backgroundColor.transparency}
						property="backgroundColor.transparency"
						onChange={onSettingsChange}
						min="0"
						max="1"
						step="0.01"
					/>
				</div>
				<div className={classes.group}>
					<h4>테두리</h4>
					<SettingItem
						title="색상"
						type="color"
						initValue={previewStyle.border.color}
						property="border.color"
						onChange={onSettingsChange}
					/>
					<SettingItem
						title="두께"
						type="range"
						initValue={previewStyle.border.width}
						property="border.width"
						onChange={onSettingsChange}
						min="0.00"
						max="0.05"
						step="0.0005"
					/>
					<SettingItem
						title="둥글기"
						type="range"
						initValue={previewStyle.borderRadius}
						property="borderRadius"
						onChange={onSettingsChange}
						min="0"
						max="1"
						step="0.01"
					/>
				</div>
				<div className={classes.group}>
					<h4>정렬</h4>
					<SettingItem
						title="가로 방향"
						type="custom-select"
						options={[
							{
								jsx: (
									<div className={classes.alignButton}>
										<i className="fas fa-align-left" />
										<p>왼쪽</p>
									</div>
								),
								value: "left",
							},
							{
								jsx: (
									<div className={classes.alignButton}>
										<i className="fas fa-align-center" />
										<p>가운데</p>
									</div>
								),
								value: "center",
							},
							{
								jsx: (
									<div className={classes.alignButton}>
										<i className="fas fa-align-right" />
										<p>오른쪽</p>
									</div>
								),
								value: "right",
							},
						]}
						initValue={previewStyle.textAlign}
						selectedClass={classes.selectedAlignment}
						property="textAlign"
						onChange={onSettingsChange}
					/>
					<SettingItem
						title="세로 방향"
						type="custom-select"
						options={[
							{
								jsx: (
									<div className={classes.alignButton}>
										<i
											className={`fas fa-align-left ${classes.rotated90Degrees}`}
										/>
										<p>위</p>
									</div>
								),
								value: "start",
							},
							{
								jsx: (
									<div className={classes.alignButton}>
										<i
											className={`fas fa-align-center ${classes.rotated90Degrees}`}
										/>
										<p>가운데</p>
									</div>
								),
								value: "center",
							},
							{
								jsx: (
									<div className={classes.alignButton}>
										<i
											className={`fas fa-align-right ${classes.rotated90Degrees}`}
										/>
										<p>아래</p>
									</div>
								),
								value: "end",
							},
						]}
						initValue={previewStyle.justifyContent}
						selectedClass={classes.selectedAlignment}
						property="justifyContent"
						onChange={onSettingsChange}
					/>
				</div>
				<div className={classes.group}>
					<h4>기타</h4>
					<SettingItem
						title="그림자"
						type="custom-select"
						options={[
							{
								jsx: (
									<div
										className={classes.boxShadowExample}
										style={{ boxShadow: "transparent 0px 0px 0px" }}
									>
										없음
									</div>
								),
								value: { color: "transparent", dimension: [0, 0, 0] },
							},
							{
								jsx: (
									<div
										className={classes.boxShadowExample}
										style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
									>
										옅게
									</div>
								),
								value: { color: "rgba(0, 0, 0, 0.16)", dimension: [0, 1, 4] },
							},
							{
								jsx: (
									<div
										className={classes.boxShadowExample}
										style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
									>
										진하게
									</div>
								),
								value: { color: "rgba(0, 0, 0, 0.35)", dimension: [0, 5, 15] },
							},
						]}
						initValue={previewStyle.boxShadow}
						selectedClass={classes.selectedBoxShadow}
						property="boxShadow"
						onChange={onSettingsChange}
					/>
					<SettingItem
						title="선 간격"
						type="range"
						initValue={previewStyle.lineHeight}
						property="lineHeight"
						onChange={onSettingsChange}
						min="1"
						max="2"
						step="0.01"
					/>
					<SettingItem
						title="여백"
						type="range"
						initValue={previewStyle.padding}
						property="padding"
						onChange={onSettingsChange}
						min="0"
						max="0.05"
						step="0.0005"
					/>
				</div>
			</ul>
			<footer className={classes.controlFooter}>
				<button onClick={onClose}>취소</button>
				<button onClick={onApplySettingsClick}>적용</button>
			</footer>
		</Modal>
	);
};

export default ObjectSettings;
