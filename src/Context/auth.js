import { createSlice } from "@reduxjs/toolkit";
import {
	signInWithGooglePopup,
	signOut as signOutFirebase,
} from "../Firebase/auth";

export const authSlice = createSlice({
	name: "auth",
	initialState: {
		user: null,
	},
	reducers: {
		signIn: (state, { payload: { uid } }) => {
			state.user = { uid };
		},
		signOut: (state) => {
			state.user = null;
		},
	},
});

export const authActions = authSlice.actions;

export const signInWithGoogle = () => {
	return async (dispatch) => {
		const user = await signInWithGooglePopup();

		dispatch(authActions.signIn(user));
	};
};

export const signOut = () => {
	return async (dispatch) => {
		signOutFirebase();

		dispatch(authActions.signOut());
	};
};
