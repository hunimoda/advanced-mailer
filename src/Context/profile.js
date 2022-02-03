import { createSlice } from "@reduxjs/toolkit";

export const profileSlice = createSlice({
	name: "profile",
	initialState: {
		NUuWYebcVadYwHylxjRX4D6WMVW2: {
			name: "Daehoon Kim",
			image:
				"https://firebasestorage.googleapis.com/v0/b/mailer-5da40.appspot.com/o/profiles%2FNUuWYebcVadYwHylxjRX4D6WMVW2%2Fdaehoon.jpg?alt=media&token=77b436e0-eed0-4c2c-86fd-e51cef51deb1",
		},
		fEtwa8LhvPdR1XM8g0YLDxu8d103: {
			name: "Lamborghini",
			image:
				"https://firebasestorage.googleapis.com/v0/b/mailer-5da40.appspot.com/o/profiles%2FfEtwa8LhvPdR1XM8g0YLDxu8d103%2Flamborghini.jpg?alt=media&token=2f898357-1367-4540-b912-3ae57b51f7dd",
		},
	},
	reducers: {
		addNewProfile: (state, { payload: { uid, profile } }) => {
			state[uid] = profile;
		},
	},
});

export const profileActions = profileSlice.actions;
