import "./init";
import {
	getStorage,
	ref,
	uploadString,
	getDownloadURL,
} from "firebase/storage";
import { getMyUid } from "./auth";
import { v4 as uuidv4 } from "uuid";

const storage = getStorage();

export const uploadImageByDataUrl = async (imageDataUrl, letterId) => {
	const storageRef = ref(
		storage,
		`${getMyUid()}/letters/${letterId}/${uuidv4()}`
	);

	const uploadResult = await uploadString(storageRef, imageDataUrl, "data_url");
	const downloadUrl = await getDownloadURL(uploadResult.ref);

	return downloadUrl;
};

export const uploadProfileImageByDataUrl = async (imageDataUrl) => {
	const storageRef = ref(storage, `users/${getMyUid()}/profile`);

	const uploadResult = await uploadString(storageRef, imageDataUrl, "data_url");
	const downloadUrl = await getDownloadURL(uploadResult.ref);

	return downloadUrl;
};
