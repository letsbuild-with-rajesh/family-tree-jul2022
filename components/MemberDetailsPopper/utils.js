import {
  doc,
  collection,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initFirebaseApp } from "../../utils/firebaseSetup";

const db = initFirebaseApp();

export const getMembersColPath = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  return "users/" + user.uid + "/family-members";
};

const getMemberData = async (id) => {
  try {
    const docRef = doc(db, getMembersColPath(), id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return [docRef, docSnap.data()];
    } else {
      throw Error("Snap of doc does not exist!");
    }
  } catch (err) {
    console.error(err);
  }
};

export const addMember = async (parentId, payload) => {
  try {
    const docRef = await addDoc(collection(db, getMembersColPath()), payload);
    if (parentId) {
      const [parentDocRef, { child_ids }] = await getMemberData(parentId);
      await updateDoc(parentDocRef, {
        child_ids: [...child_ids, docRef.id],
      });
    }
  } catch (err) {
    console.error(err);
  }
};

export const updateMember = async (id, payload) => {
  try {
    const [docRef] = await getMemberData(id);
    await updateDoc(docRef, payload);
  } catch (err) {
    console.error(err);
  }
};

export const deleteMember = async (id) => {
  const deleteChildrenRecursively = async (id) => {
    try {
      const docRef = doc(db, getMembersColPath(), id);
      const { child_ids } = (await getMemberData(id))[1];
      // Remove childrens
      child_ids.forEach((id) => {
        deleteChildrenRecursively(id);
      });
      await deleteDoc(docRef);
    } catch (err) {
      console.error(err);
    }
  };
  try {
    const { parent_ids } = (await getMemberData(id))[1];
    // Remove from parents
    parent_ids.forEach(async (parentId) => {
      const [parentDocRef, { child_ids }] = await getMemberData(parentId);
      await updateDoc(parentDocRef, {
        child_ids: child_ids.filter((childId) => childId !== id),
      });
    });
    deleteChildrenRecursively(id);
  } catch (err) {
    console.error(err);
  }
};
