import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { initFirebaseApp } from "../../utils/firebaseSetup";
import { getMembersCollectionPath, handleErrors } from "../../utils/util";

const db = initFirebaseApp();

const getPhotoFilenamePath = (fileName) => {
  const auth = getAuth();
  const user = auth.currentUser;
  return "images/user/" + user.uid + "/" + fileName;
};

export const deletePicture = async (fileName) => {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, getPhotoFilenamePath(fileName));
    await deleteObject(storageRef);
  } catch (err) {
    handleErrors(err);
  }
};

export const uploadPicture = async (file) => {
  try {
    const storage = getStorage();
    const fileName = uuidv4() + "_" + file.name;
    const storageRef = ref(storage, getPhotoFilenamePath(fileName));
    await uploadBytes(storageRef, file);
    return { fileName, url: await getDownloadURL(storageRef) };
  } catch (err) {
    handleErrors(err);
  }
};

const getMemberData = async (id) => {
  try {
    const docRef = doc(db, await getMembersCollectionPath(), id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return [docRef, docSnap.data()];
    } else {
      throw Error("Snap of doc does not exist!");
    }
  } catch (err) {
    handleErrors(err);
  }
};

export const addMember = async (parentId, payload) => {
  try {
    const docRef = await addDoc(collection(db, await getMembersCollectionPath()), payload);
    if (parentId) {
      const [parentDocRef, { child_ids }] = await getMemberData(parentId);
      await updateDoc(parentDocRef, {
        child_ids: [...child_ids, docRef.id],
      });
    }
  } catch (err) {
    handleErrors(err);
  }
};

export const updateMember = async (id, payload) => {
  try {
    const [docRef] = await getMemberData(id);
    await updateDoc(docRef, payload);
  } catch (err) {
    handleErrors(err);
  }
};

export const deleteMember = async (id) => {
  const deleteChildrenRecursively = async (id) => {
    try {
      const docRef = doc(db, await getMembersCollectionPath(), id);
      const { child_ids, photoName } = (await getMemberData(id))[1];
      // Remove childrens
      child_ids.forEach((id) => {
        deleteChildrenRecursively(id);
      });
      if (photoName) {
        await deletePicture(photoName);
      }
      await deleteDoc(docRef);
    } catch (err) {
      handleErrors(err);
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
    handleErrors(err);
  }
};
