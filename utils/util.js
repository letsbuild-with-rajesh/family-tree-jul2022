import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initFirebaseApp } from "./firebaseSetup";

const db = initFirebaseApp();

export const getUserDocPath = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  return "users/" + user.uid;
}

export const getTreesCollectionPath = () => {
  return getUserDocPath() + "/trees";
};

export const getActiveTreeDocPath = async () => {
  try {
    const docRef = doc(db, getUserDocPath());
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { active_tree: activeTree } = docSnap.data();
      return getTreesCollectionPath() + "/" + activeTree;
    }
  } catch (err) {
    handleErrors(err);
  }
}

export const getMembersCollectionPath = async (treeId = null) => {
  if (treeId) {
    return getTreesCollectionPath() + "/" + treeId + "/family-members";
  }
  return (await getActiveTreeDocPath()) + "/family-members";
};

export const handleErrors = (error) => {
  console.error(error.code ? error.code : error);
  let alertMsg = "Something went wrong! Please try again later.";
  switch (error.code) {
    case "auth/user-not-found":
      alertMsg = "No user with the provided Email Id exist! Please sign up.";
      break;
    case "auth/invalid-email":
    case "auth/wrong-password":
      alertMsg = "Invalid Credentials";
      break;
    case "auth/email-already-in-use":
      alertMsg = "Email Id already exists! Please Sign in.";
      break;
    case "permission-denied":
      alertMsg = "Access Denied!";
      break;
    case "storage/unauthorized":
      alertMsg = "Unauthorized to upload picture";
      break;
    case "storage/canceled":
      alertMsg = "Upload cancelled!";
      break;
    case "storage/unknown":
      alertMsg = "Unknown storage error";
      break;
    default:
      break;
  }
  alert(alertMsg);
};
