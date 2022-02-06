import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./auth";
import { profileSlice } from "./profile";
import { pageSlice } from "./page";

const store = configureStore({
	reducer: {
		auth: authSlice.reducer,
		profile: profileSlice.reducer,
		page: pageSlice.reducer,
	},
});

export default store;
