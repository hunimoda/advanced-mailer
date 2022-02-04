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

	for (let i = 0; i < 128; i++) {
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

export const getLetterById = async (letterId) => {
	const docRef = doc(db, `letters/${letterId}`);
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

export const isInbox = async (letter) => {
	const docRef = doc(db, `users/${getMyUid()}/inbox/${letter}`);
	const docSnap = await getDoc(docRef);

	return docSnap.exists();
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

export const getSentLettersBeforeTimestamp = async (timestamp, limitCount) => {
	const sentLettersRef = collection(db, `users/${getMyUid()}/sent`);
	const q = query(
		sentLettersRef,
		where("metaData.createdAt", "<", timestamp),
		orderBy("metaData.createdAt", "desc"),
		limit(limitCount)
	);

	const sentLetters = [];
	const querySnapshot = await getDocs(q);

	querySnapshot.forEach((doc) =>
		sentLetters.push({ id: doc.id, ...doc.data() })
	);

	return sentLetters;
};

export const getSentLetters = async () => {
	const querySnapshot = await getDocs(
		collection(db, `users/${getMyUid()}/sent`)
	);
	const sentLetters = [];

	querySnapshot.forEach((doc) =>
		sentLetters.push({ id: doc.id, description: doc.data() })
	);

	return sentLetters;
};

export const getProfile = async (uid) => {
	const docRef = doc(db, `profiles/${uid}`);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		return docSnap.data();
	}

	return null;
};
