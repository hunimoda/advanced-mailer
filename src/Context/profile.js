import { createSlice } from "@reduxjs/toolkit";

export const profileSlice = createSlice({
	name: "profile",
	initialState: {},
	reducers: {
		addNewProfile: (state, { payload: { uid, profile } }) => {
			state[uid] = profile;
		},
	},
});

export const profileActions = profileSlice.actions;
