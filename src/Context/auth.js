import { createSlice } from "@reduxjs/toolkit";
import { signInWithGooglePopup } from "../Firebase/auth";

export const authSlice = createSlice({
	name: "auth",
	initialState: {
		user: null,
	},
	reducers: {
		signIn: (state, { payload: user }) => {
			state.user = user;
		},
		signOut: (state) => {
			state.user = null;
		},
	},
});

export const signInWithGoogle = () => {
	return async (dispatch) => {
		const user = await signInWithGooglePopup();

		dispatch(authSlice.actions.signIn(user));
	};
};
