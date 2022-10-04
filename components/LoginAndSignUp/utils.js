import {
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut as signOutFirebase,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { initFirebaseApp } from "../../utils/firebaseSetup";
import { handleErrors } from "../../utils/util";

const db = initFirebaseApp();

export const signUp = async (email, password, successCb, failureCb) => {
  const auth = getAuth();
  await setPersistence(auth, browserSessionPersistence);
  await createUserWithEmailAndPassword(auth, email, password)
    .then(async () => {
      const user = auth.currentUser;
      await auth.signOut();
      await setDoc(doc(db, "users", user.uid), {});
      sendEmailVerification(user);
      successCb();
    })
    .catch((error) => {
      failureCb();
      handleErrors(error);
    });
};

export const signIn = async (email, password, successCb, failureCb) => {
  const auth = getAuth();
  await setPersistence(auth, browserSessionPersistence);
  signInWithEmailAndPassword(auth, email, password)
    .then(async () => {
      const user = auth.currentUser;
      if (!user.emailVerified) {
        await auth.signOut();
        alert("Please verify email before sign in!");
      }
      successCb();
    })
    .catch((error) => {
      failureCb();
      handleErrors(error);
    });
};

export const signOut = () => {
  const auth = getAuth();
  signOutFirebase(auth)
    .then(() => {
      // signed out
    })
    .catch((error) => {
      console.error(error);
    });
};

export const addAuthStateObserver = (cbIfSignedIn, cbIfNotSignedIn) => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      cbIfSignedIn(user);
    } else {
      cbIfNotSignedIn();
    }
  });
};

export const sendPasswordResetUrl = (email, successCb, failureCb) => {
  const auth = getAuth();
  sendPasswordResetEmail(auth, email)
    .then(() => {
      successCb();
    })
    .catch((error) => {
      failureCb();
      handleErrors(error);
    });
};
