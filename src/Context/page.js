import { createSlice } from "@reduxjs/toolkit";

export const pageSlice = createSlice({
	name: "page",
	initialState: {
		sent: {
			startTimestamp: null,
			endTimestamp: null,
			letters: [],
		},
	},
	reducers: {
		push: (state, { payload: letters }) => {
			if (letters.length !== 0) {
				const startTimestamp = letters[letters.length - 1].metaData.createdAt;

				state.sent.startTimestamp = startTimestamp;
			}
			state.sent.letters.push(...letters);
		},
	},
});

export const pageActions = pageSlice.actions;
