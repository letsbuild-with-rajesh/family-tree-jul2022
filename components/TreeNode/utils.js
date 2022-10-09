import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc } from "firebase/firestore";
import html2canvas from "html2canvas";
import { initFirebaseApp } from "../../utils/firebaseSetup";
import { deleteMember } from '../MemberDetailsPopper/utils';
import { getTreesCollectionPath, getUserDocPath, handleErrors } from "../../utils/util";

const TREE_NODE_LEVEL_COLORS = [
  "#dbc2a6",
  "#17d9a7",
  "#a955a1",
  "#6fe9f1",
  "#fda54f",
  "#d9ed9e",
  "#2ad783",
  "#65bad7",
  "#be5572",
  "#9ed832",
];

const MAX_LEVEL = TREE_NODE_LEVEL_COLORS.length;

export const getTreeNodeLevelColor = (level) => {
  if (level > MAX_LEVEL) {
    level = level % MAX_LEVEL;
  }
  return {
    backgroundColor: TREE_NODE_LEVEL_COLORS[level - 1],
    color: "black",
  };
};

export const exportAsImage = async (element, imageFileName) => {
  /* CORS Policy is manually set to allow for only restricted domain with gsutil
  External images will not be loaded on localhost exported images. */
  const canvas = await html2canvas(element, { scale: 6, allowTaint: true, useCORS: true });
  const image = canvas.toDataURL("image/jpeg", 1.0);
  downloadImage(image, imageFileName);
};

const downloadImage = (blob, fileName) => {
  const link = document.createElement("a");
  link.download = fileName;
  link.href = blob;
  link.click();
  link.remove();
};

const db = initFirebaseApp();

export const initTreeIfNeeded = async () => {
  try {
    const docRef = doc(db, getUserDocPath());
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { active_tree: activeTree } = docSnap.data();
      if (!activeTree) {
        addANewTree();
      }
    }
  } catch (err) {
    handleErrors(err);
  }
};

export const addANewTree = async (treeName = "Untitled tree") => {
  try {
    const treeRef = await addDoc(collection(db, getTreesCollectionPath()), { tree_name: treeName });
    const userRef = doc(db, getUserDocPath());
    updateDoc(userRef, { active_tree: treeRef.id });
  } catch (err) {
    handleErrors(err);
  }
};

export const setActiveTree = (id) => {
  try {
    const userRef = doc(db, getUserDocPath());
    updateDoc(userRef, { active_tree: id });
  } catch (err) {
    handleErrors(err);
  }
}

export const renameTree = (id, newName) => {
  try {
    const treeRef = doc(db, getTreesCollectionPath(), id);
    updateDoc(treeRef, { tree_name: newName });
  } catch (err) {
    handleErrors(err);
  }
}

export const deleteTree = async (id) => {
  try {
    const membersRef = query(collection(db, getTreesCollectionPath() + "/" + id + "/family-members"));
    const membersSnaps = await getDocs(membersRef);

    let rootMemberId = '';
    membersSnaps.forEach((memberDoc) => {
      if (memberDoc.exists()) {
        const { root_member } = memberDoc.data();
        if (root_member) {
          rootMemberId = memberDoc.id;
        }
      }
    });

    const treeRef = doc(db, getTreesCollectionPath(), id);
    await deleteMember(rootMemberId, id);
    await deleteDoc(treeRef);
  } catch (err) {
    handleErrors(err);
  }
}