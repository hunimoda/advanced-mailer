import { auth } from "../Firebase/auth";
import store from "../Context";
import { getProfile } from "../Firebase/db";

export const getProfileByUid = async (uid) => {
	const profiles = store.getState().profile;
	const dispatch = store.dispatch;

	let profile = profiles[uid];

	if (!profile) {
		profile = (await getProfile(uid)) ?? {
			name: "(이름 없음)",
			image: "/default-profile.png",
		};
		dispatch({ type: "profile/addNewProfile", payload: { uid, profile } });
	}

	return JSON.parse(JSON.stringify(profile));
};

export const getMyProfile = () => {
	return getProfileByUid(auth.currentUser.uid);
};
