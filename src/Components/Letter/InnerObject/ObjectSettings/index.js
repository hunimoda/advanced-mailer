import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { letterActions } from "../../../../Context/letter";
import Modal from "../../../../UI/Modal";
import InnerObject from "..";
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

			if (property === "scale") {
				newStyle.transform.scale = Number(value);
			} else {
				newStyle[property] = value;
			}

			return newStyle;
		});
	};

	return (
		<Modal className={classes.objectSettings} onClose={onClose}>
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
				<li>
					<h4>글자 색</h4>
					<input
						data-property="color"
						type="color"
						onChange={onSettingsChange}
					/>
				</li>
				<li>
					<h4>폰트</h4>
					<select
						data-property="fontFamily"
						name="font"
						onChange={onSettingsChange}
					>
						<option value="Arial">Arial</option>
						<option value="Arial Black">Arial Black</option>
						<option value="Verdana">Verdana</option>
						<option value="Tahoma">Tahoma</option>
						<option value="Trebuchet MS">Trebuchet MS</option>
					</select>
				</li>
				<li>
					<h4>크기</h4>
					<input
						data-property="scale"
						type="range"
						min="0.005"
						max="0.1"
						step="0.005"
						onChange={onSettingsChange}
					/>
				</li>
				<li>그림자</li>
				<li>선 간격</li>
				<li>
					<h4>배경 색</h4>
					<input
						data-property="background"
						type="color"
						onChange={onSettingsChange}
					/>
				</li>
				<li>테두리</li>
				<li>여백</li>
				<li>정렬</li>
			</ul>
			<footer>
				<button>취소</button>
				<button
					onClick={() =>
						dispatch(
							letterActions.setAllStyleAtOnce({ id, style: previewStyle })
						)
					}
				>
					적용
				</button>
			</footer>
		</Modal>
	);
};

export default ObjectSettings;
