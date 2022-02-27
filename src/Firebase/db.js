import {
	getFirestore,
	doc,
	collection,
	getDoc,
	getDocs,
	setDoc,
	deleteDoc,
	query,
	where,
	orderBy,
	limit,
} from "firebase/firestore";
import "./init";
import { getMyUid } from "./auth";

const db = getFirestore();

const generateRandomId = () => {
	let id = "";
	const PUSH_CHARS =
		"-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";

	for (let i = 0; i < 22; i++) {
		const randIdx = Math.floor(Math.random() * 64);

		id += PUSH_CHARS.charAt(randIdx);
	}

	return id;
};

const getSummaryFromSheetObjects = (objects) => {
	let summary = "";

	objects.forEach((object) => {
		if (object.type === "text") {
			summary += " " + object.value.trim();
		}
	});

	summary = summary.replaceAll("\n", " ").trim();

	if (summary.length === 0) {
		summary = "(내용 없음)";
	} else if (summary.length > 50) {
		summary = summary.substr(0, 50).trim() + "...";
	}

	return summary;
};

const createMetaData = (sheet) => {
	const writerUid = getMyUid();
	const createdAt = Date.now();

	return { writerUid, createdAt };
};

export const getLetterDocByParams = async (uid, id, type) => {
	const docRef = doc(db, `users/${uid}/${type ?? "sent"}/${id}`);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		return docSnap.data();
	}

	return null;
};

export const sendLetter = async (letter, id) => {
	const metaData = createMetaData(letter);
	const docRef = doc(db, `users/${getMyUid()}/sent/${id}`);

	return setDoc(docRef, { metaData, letter });
};

export const saveLetterAsDocument = async (letter, id, type) => {
	const metaData = createMetaData(letter);
	const docRef = doc(db, `users/${getMyUid()}/${type}/${id}`);

	return setDoc(docRef, { metaData, letter });
};

export const deleteLetterByTypeAndId = async (type, id) => {
	await deleteDoc(doc(db, `users/${getMyUid()}/${type}/${id}`));
};

export const saveLetterToInbox = (letterDoc, letterId) => {
	const docRef = doc(db, `users/${getMyUid()}/inbox/${letterId}`);

	return setDoc(docRef, letterDoc);
};

export const getInboxes = async () => {
	const querySnapshot = await getDocs(
		collection(db, `users/${getMyUid()}/inbox`)
	);
	const inboxes = [];

	querySnapshot.forEach((doc) =>
		inboxes.push({ id: doc.id, description: doc.data() })
	);

	return inboxes;
};

const getLetters = async (pageName, relation, timestamp, limitCount) => {
	const lettersRef = collection(db, `users/${getMyUid()}/${pageName}`);
	const q = query(
		lettersRef,
		where("metaData.createdAt", relation === "before" ? "<" : ">", timestamp),
		orderBy("metaData.createdAt", "desc"),
		limit(limitCount ?? 20)
	);

	const letters = [];
	const querySnapshot = await getDocs(q);

	querySnapshot.forEach((doc) => letters.push({ id: doc.id, ...doc.data() }));

	return letters;
};

export const getLettersAfterTimestamp = (pageName, timestamp) =>
	getLetters(pageName, "after", timestamp);

export const getLettersBeforeTimestamp = (pageName, timestamp, limitCount) =>
	getLetters(pageName, "before", timestamp, limitCount);

export const getProfile = async (uid) => {
	const docRef = doc(db, `users/${uid}`);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		return docSnap.data();
	}

	return null;
};

export const saveProfileImage = async (downloadUrl) => {
	const profileRef = doc(db, `users/${getMyUid()}`);

	return setDoc(profileRef, { image: downloadUrl }, { merge: true });
};

export const saveProfileName = async (name) => {
	const profileRef = doc(db, `users/${getMyUid()}`);

	return setDoc(profileRef, { name }, { merge: true });
};

export const getSheetDesigns = async () => {
	const docRef = doc(db, "design/sheets");
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		return docSnap.data().downloadUrls;
	}

	return null;
};
