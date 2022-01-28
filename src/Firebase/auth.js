import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import "./init";

const auth = getAuth();

const google = new GoogleAuthProvider();

export const signInWithGooglePopup = async () => {
	const {
		user: { uid },
	} = await signInWithPopup(auth, google);

	return { uid };
};
