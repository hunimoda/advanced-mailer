import { auth } from "../Firebase/auth";
import store from "../Context";
import { getProfile } from "../Firebase/db";

export const getProfileByUid = async (uid) => {
	const profiles = store.getState().profile;
	const dispatch = store.dispatch;

	let profile = profiles[uid];

	if (!profile) {
		profile = (await getProfile(uid)) ?? { name: "", image: "" };
		dispatch({ type: "profile/addNewProfile", payload: { uid, profile } });
	}

	profile = JSON.parse(JSON.stringify(profile));
	profile.image ||= "/default-profile.png";
	profile.name ||= "(이름 없음)";

	return profile;
};

export const getMyProfile = () => {
	return getProfileByUid(auth.currentUser.uid);
};
