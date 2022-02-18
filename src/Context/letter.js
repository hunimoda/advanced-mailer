import { createSlice } from "@reduxjs/toolkit";

const INIT_LETTER = {
	backgroundImage: null,
	sheet: {
		aspectRatio: 0.75,
		backgroundColor: "pink",
		backgroundImage: null,
	},
	objects: {
		temp: {
			type: "text",
			value:
				"오늘은 3.1절입니다.\n독립열사들의 정신을 기리며\n조국을 수호합시다!",
			style: {
				backgroundColor: "white",
				fontFamily: "monospace",
				height: 0.2,
				left: 0.1,
				lineHeight: 1.5,
				textAlign: "center",
				top: 0.1,
				transform: {
					scale: 0.02,
					rotate: -10,
				},
				width: 0.8,
				zIndex: 1,
			},
		},
		another: {
			type: "image",
			value: "https://place-hold.it/300x500",
			style: {
				left: 0.1,
				top: 0.5,
				height: 0.5,
				width: 0.4,
				zIndex: 2,
				transform: {
					rotate: 0,
				},
			},
		},
	},
};

export const letterSlice = createSlice({
	name: "letter",
	initialState: INIT_LETTER,
	reducers: {
		resizeSheet: (state, action) => {
			state.sheet.aspectRatio = action.payload;
		},
		setSheetBgColor: (state, action) => {
			state.sheet.backgroundColor = action.payload;
		},
		setSheetBgImage: (state, action) => {
			state.sheet.backgroundImage = action.payload;
		},
	},
});

export const letterActions = letterSlice.actions;
