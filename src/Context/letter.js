import { createSlice } from "@reduxjs/toolkit";

export const INIT_LETTER = {
	backgroundImage: null,
	sheet: {
		size: null,
		aspectRatio: 0.75,
		backgroundColor: "white",
		backgroundImage: null,
	},
	objects: {},
	canvas: null,
};

let maxZIndex = 0;

const generateObjectId = () => {
	const idxArray = [];
	const ID_CHARS =
		"-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";

	let timestamp = Date.now();

	while (timestamp > 0) {
		idxArray.unshift(timestamp % 64);
		timestamp = Math.floor(timestamp / 64);
	}

	for (let i = 0; i < 16; i++) {
		idxArray.push(Math.floor(Math.random() * 64));
	}

	return idxArray.map((idx) => ID_CHARS[idx]).join("");
};

const getImageAspectRatioFromSrc = (src) =>
	new Promise((resolved, rejected) => {
		const image = new Image();

		image.onload = () => resolved(image.width / image.height);
		image.src = src;
	});

export const letterSlice = createSlice({
	name: "letter",
	initialState: INIT_LETTER,
	reducers: {
		setLetterState: (state, action) => {
			const { backgroundImage, sheet, objects } = action.payload;

			state.backgroundImage = backgroundImage;
			state.sheet = sheet;
			state.objects = objects;
		},
		resetLetterState: (state) => {
			state.backgroundImage = INIT_LETTER.backgroundImage;
			state.sheet = INIT_LETTER.sheet;
			state.objects = INIT_LETTER.objects;
		},
		setSheetSize: (state, action) => {
			state.sheet.size = action.payload;
		},
		resizeSheet: (state, action) => {
			state.sheet.aspectRatio = action.payload;
		},
		setSheetBgColor: (state, action) => {
			state.sheet.backgroundColor = action.payload;
		},
		setSheetBgImage: (state, action) => {
			state.sheet.backgroundImage = action.payload;
		},
		resetSheetBgImage: (state, action) => {
			state.sheet.backgroundImage = null;
		},
		addTextObject: (state, action) => {
			state.objects[generateObjectId()] = {
				type: "text",
				value: action.payload,
				style: {
					width: 0.5,
					height: 0.1,
					top: 0.45,
					left: 0.25,
					transform: {
						scale: 0.04,
						rotate: 0,
					},
					color: {
						rgb: "#000000",
						transparency: 0,
					},
					fontFamily: "Arial",
					backgroundColor: {
						rgb: "#ffffff",
						transparency: 1,
					},
					textShadow: {
						color: "transparent",
						size: 0,
					},
					border: {
						color: "transparent",
						width: 0,
					},
					borderRadius: 0,
					lineHeight: 1,
					justifyContent: "center",
					textAlign: "center",
					boxShadow: {
						color: "transparent",
						dimension: [0, 0, 0],
					},
					padding: 0,
					zIndex: ++maxZIndex,
				},
			};
		},
		editText: (state, action) => {
			const { id, value } = action.payload;

			state.objects[id].value = value;
		},
		addImageObject: (state, action) => {
			const image = action.payload;
			const sheetRatio = state.sheet.aspectRatio;

			const width = Math.min(1, image.ratio / sheetRatio) / 2;
			const height = Math.min(1, sheetRatio / image.ratio) / 2;

			state.objects[generateObjectId()] = {
				type: "image",
				value: image.src,
				style: {
					width,
					height,
					top: 0.5 - height / 2,
					left: 0.5 - width / 2,
					transform: {
						scale: 0.04,
						rotate: 0,
					},
					border: {
						color: "transparent",
						width: 0,
					},
					padding: 0,
					zIndex: ++maxZIndex,
					color: {
						rgb: "#000000",
						transparency: 0,
					},
					fontFamily: "Arial",
					backgroundColor: {
						rgb: "#ffffff",
						transparency: 1,
					},
					textShadow: {
						color: "transparent",
						size: 0,
					},
					borderRadius: 0,
					lineHeight: 1,
					justifyContent: "center",
					textAlign: "center",
					boxShadow: {
						color: "transparent",
						dimension: [0, 0, 0],
					},
				},
			};
		},
		moveObject: (state, action) => {
			const { id, left, top } = action.payload;

			state.objects[id].style.left += left;
			state.objects[id].style.top += top;
		},
		resizeObjectFixedAspectRatio: (state, action) => {
			const { id, width, height, angle } = action.payload;

			state.objects[id].style.width = width;
			state.objects[id].style.height = height;
			state.objects[id].style.transform.rotate = angle;
		},
		resizeObjectSide: (state, action) => {
			const { id, length, side } = action.payload;

			state.objects[id].style[side] = length;
		},
		deleteObject: (state, action) => {
			delete state.objects[action.payload];
		},
		moveObjectToFront: (state, action) => {
			state.objects[action.payload].style.zIndex = ++maxZIndex;
		},
		setAllStyleAtOnce: (state, action) => {
			const { id, style } = action.payload;

			state.objects[id].style = style;
		},
		setCanvas: (state, action) => {
			state.canvas = action.payload;
		},
	},
});

export const letterActions = letterSlice.actions;

export const addImageObjectBySrc = (imageSrc) => {
	return async (dispatch) =>
		dispatch(
			letterActions.addImageObject({
				src: imageSrc,
				ratio: await getImageAspectRatioFromSrc(imageSrc),
			})
		);
};

export const setSheetBgImageResize = (bgImageSrc) => {
	return async (dispatch) => {
		const imageRatio = await getImageAspectRatioFromSrc(bgImageSrc);

		dispatch(letterActions.resizeSheet(imageRatio));
		dispatch(letterActions.setSheetBgImage(bgImageSrc));
	};
};
