import { createSlice } from "@reduxjs/toolkit";
import { getMyUid } from "../Firebase/auth";

export const profileSlice = createSlice({
	name: "profile",
	initialState: {},
	reducers: {
		addNewProfile: (state, { payload: { uid, profile } }) => {
			state[uid] = profile;
		},
		changeMyProfileImage: (state, action) => {
			state[getMyUid()].image = action.payload;
		},
		changeMyProfileName: (state, action) => {
			state[getMyUid()].name = action.payload;
		},
	},
});

export const profileActions = profileSlice.actions;
