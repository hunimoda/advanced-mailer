import {
	getFirestore,
	collection,
	doc,
	getDoc,
	addDoc,
} from "firebase/firestore";
import "./init";

const db = getFirestore();

export const getLetter = async (sender, letter) => {
	const docRef = doc(db, `senders/${sender}/letters/${letter}`);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		return docSnap.data();
	}

	return null;
};

export const addLetter = async (sender, data) => {
	const docRef = await addDoc(
		collection(db, `senders/${sender}/letters`),
		data
	);

	return docRef.id;
};
