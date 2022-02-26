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
			console.log(getMyUid(), action.payload);
			state[getMyUid()].image = action.payload;
		},
	},
});

export const profileActions = profileSlice.actions;
