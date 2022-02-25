import { createSlice } from "@reduxjs/toolkit";

export const pageSlice = createSlice({
	name: "page",
	initialState: {
		sent: {
			timestamp: { start: null, end: null },
			letters: [],
			scrollPosition: null,
			needsRefresh: false,
		},
		inbox: {
			timestamp: { start: null, end: null },
			letters: [],
			scrollPosition: null,
		},
	},
	reducers: {
		append: (state, { payload: { pageName, letters } }) => {
			state[pageName].letters.push(...letters);
		},
		prepend: (state, { payload: { pageName, letters } }) => {
			state[pageName].letters.unshift(...letters);
		},
		setTimestamp: (state, { payload: { pageName, timestamp } }) => {
			state[pageName].timestamp = timestamp;
		},
		rememberScrollPosition: (
			state,
			{ payload: { pageName, scrollPosition } }
		) => {
			state[pageName].scrollPosition = scrollPosition;
		},
		resetScrollPosition: (state, action) => {
			state[action.payload].scrollPosition = null;
		},
		setNeedsRefresh: (state, action) => {
			state.sent.needsRefresh = action.payload;
		},
	},
});

export const pageActions = pageSlice.actions;
