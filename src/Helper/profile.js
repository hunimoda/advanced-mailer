import store from "../Context";
import { getProfile } from "../Firebase/db";

export const getProfileByUid = async (uid) => {
	const profiles = store.getState().profile;
	const dispatch = store.dispatch;

	let profile = profiles[uid];

	if (!profile) {
		profile = await getProfile(uid);
		dispatch({ type: "profile/addNewProfile", payload: { uid, profile } });
	}

	return profile;
};
