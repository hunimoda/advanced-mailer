import {
	getFirestore,
	collection,
	doc,
	getDoc,
	// getDocs,
	addDoc,
} from "firebase/firestore";
import "./init";

const db = getFirestore();

export const getLetter = async (sender, letter) => {
	const docRef = doc(db, `users/${sender}/letters/${letter}`);
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

export const addLetter = async (sender, data) => {
	const docRef = await addDoc(collection(db, `users/${sender}/letters`), data);

	return docRef.id;
};

export const isInbox = async (uid, letter) => {
	const docRef = doc(db, `users/${uid}/inbox/${letter}`);
	const docSnap = await getDoc(docRef);

	return docSnap.exists();
};
