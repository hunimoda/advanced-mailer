import {
	getFirestore,
	doc,
	collection,
	getDoc,
	getDocs,
	setDoc,
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
	const summary = getSummaryFromSheetObjects(sheet.objects);
	const previewImageUrl = "https://place-hold.it/300x500";

	return { writerUid, createdAt, summary, previewImageUrl };
};

export const getLetterByParams = async (uid, type, id) => {
	const docRef = doc(db, `users/${uid}/${type}/${id}`);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		return docSnap.data();
	}

	return null;
};

export const sendLetter = async (sheet) => {
	const metaData = createMetaData(sheet);

	const letterId = generateRandomId();
	const docRef = doc(db, `users/${getMyUid()}/sent/${letterId}`);

	await setDoc(docRef, { metaData, sheet });
};

export const saveLetterToInbox = (letter, description) => {
	const docRef = doc(db, `users/${getMyUid()}/inbox/${letter}`);

	return setDoc(docRef, description);
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

export const getLettersBeforeTimestamp = (pageName, timestamp) =>
	getLetters(pageName, "before", timestamp, 1);

export const getProfile = async (uid) => {
	const docRef = doc(db, `profiles/${uid}`);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		return docSnap.data();
	}

	return null;
};
