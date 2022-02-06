import { createSlice } from "@reduxjs/toolkit";

export const pageSlice = createSlice({
	name: "page",
	initialState: {
		sent: {
			timestamp: { start: null, end: null },
			letters: [],
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
	},
});

export const pageActions = pageSlice.actions;
