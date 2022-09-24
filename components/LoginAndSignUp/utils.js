import {
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut as signOutFirebase,
} from "firebase/auth";
import { initFirebaseApp } from "../../utils/firebaseSetup";

initFirebaseApp();

const handleErrors = (error) => {
  console.log(error);
  let alertMsg = "Something went wrong! Please try again later.";
  if (error.code === "auth/user-not-found") {
    alertMsg = "No user with the provided Email Id exist! Please sign up.";
  }
  if (
    error.code === "auth/invalid-email" ||
    error.code === "auth/wrong-password"
  ) {
    alertMsg = "Invalid Credentials";
  }
  if (error.code === "auth/email-already-in-use") {
    alertMsg = "Email Id already exists! Please Sign in.";
  }
  alert(alertMsg);
};

export const signUp = async (email, password, cb) => {
  const auth = getAuth();
  await setPersistence(auth, browserSessionPersistence);
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      cb();
    })
    .catch((error) => {
      handleErrors(error);
    });
};

export const signIn = async (email, password, cb) => {
  const auth = getAuth();
  await setPersistence(auth, browserSessionPersistence);
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      cb();
    })
    .catch((error) => {
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
      console.log(error);
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

export const sendPasswordResetUrl = (email, cb) => {
  const auth = getAuth();
  sendPasswordResetEmail(auth, email)
    .then(() => {
      cb();
    })
    .catch((error) => {
      handleErrors(error);
    });
};
