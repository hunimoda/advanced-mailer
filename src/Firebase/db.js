import {
	getFirestore,
	doc,
	collection,
	getDoc,
	getDocs,
	setDoc,
} from "firebase/firestore";
import "./init";
import { auth } from "./auth";

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

export const getLetter = async (letter) => {
	const docRef = doc(db, `letters/${letter}`);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		return docSnap.data();
	}

	return null;
};

// export const getLetters = async (sender) => {
// 	const querySnapshot = await getDocs(
// 		collection(db, `users/${sender}/letters`)
// 	);

// 	querySnapshot.forEach((doc) => console.log(doc.id, " => ", doc.data()));
// };

const DUMMY_SHEET = {
	aspectRatio: 0.75,
	backgroundColor: "teal",
	objects: [
		{
			style: {
				backgroundColor: "tomato",
				fontFamily: "monospace",
				height: 0.17,
				left: 0.1725,
				lineHeight: 2.1666,
				top: 0.296666,
				transform: {
					scale: 0.0216666,
				},
				width: 0.4375,
				zIndex: 2,
			},
			type: "text",
			value: "후니모다의 보낸 편지 테스트입니다!\n사이트 만들기 힘드네요",
		},
	],
};

export const addLetter = async (sheetData) => {
	const data = {
		sheet: DUMMY_SHEET,
		writerUid: auth.currentUser.uid,
	};
	const letterId = generateRandomId();

	await setDoc(doc(db, `letters/${letterId}`), data);
};

export const isInbox = async (letter) => {
	const docRef = doc(db, `users/${auth.currentUser.uid}/inbox/${letter}`);
	const docSnap = await getDoc(docRef);

	return docSnap.exists();
};

export const saveLetterToInbox = (letter, description) => {
	const docRef = doc(db, `users/${auth.currentUser.uid}/inbox/${letter}`);

	return setDoc(docRef, description);
};

export const getInboxes = async () => {
	const querySnapshot = await getDocs(
		collection(db, `users/${auth.currentUser.uid}/inbox`)
	);
	const inboxes = [];

	querySnapshot.forEach((doc) =>
		inboxes.push({ id: doc.id, description: doc.data() })
	);

	return inboxes;
};

export const getSentLetters = async () => {
	const querySnapshot = await getDocs(
		collection(db, `users/${auth.currentUser.uid}/sent`)
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
