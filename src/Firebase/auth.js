import {
	getAuth,
	onAuthStateChanged,
	GoogleAuthProvider,
	signInWithPopup,
	signOut as signOutFirebase,
} from "firebase/auth";
import "./init";

export const auth = getAuth();

const google = new GoogleAuthProvider();

export const signInWithGooglePopup = async () => {
	const { user } = await signInWithPopup(auth, google);

	return user.toJSON();
};

export const signOut = () => signOutFirebase(auth);

export const setAuthObserver = (callback) => {
	onAuthStateChanged(auth, callback);
};
