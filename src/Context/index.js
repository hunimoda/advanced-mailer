import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./auth";
import { profileSlice } from "./profile";
import { pageSlice } from "./page";
import { letterSlice } from "./letter";

const store = configureStore({
	reducer: {
		auth: authSlice.reducer,
		profile: profileSlice.reducer,
		page: pageSlice.reducer,
		letter: letterSlice.reducer,
	},
});

export default store;
