import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
	name: "auth",
	initialState: {
		user: null,
	},
	reducers: {
		signIn: (state, action) => {},
		signOut: (state) => {
			state.user = null;
		},
	},
});
