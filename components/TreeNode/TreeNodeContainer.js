import React, { useEffect, useRef, useState } from "react";
import { collection, doc, getDoc, getDocs, query, onSnapshot } from "firebase/firestore";
import TreeNode from "./TreeNode";
import MemberDetailsPopper from "../MemberDetailsPopper";
import Loader from "../Loader";
import { initFirebaseApp } from "../../utils/firebaseSetup";
import { addAuthStateObserver, signOut } from "../../components/LoginAndSignUp/utils";
import {
  getActiveTreeDocPath, getMembersCollectionPath, getTreesCollectionPath,
  getUserDocPath,
} from "../../utils/util";
import { addANewTree, deleteTree, exportAsImage, renameTree, setActiveTree as setActiveTreeUtil } from "./utils";
import styles from "../../styles/TreeNode.module.scss";

const db = initFirebaseApp();

const TreeNodeContainer = () => {
  const [user, setUser] = useState({});
  const [hideControlsBeforeExport, setHideControlsBeforeExport] = useState(false);
  const [showAddMemberPopup, setShowAddMemberPopup] = useState(false);
  const [activeTree, setActiveTree] = useState('');
  const [rootMember, setRootMember] = useState({});
  const [membersMap, setMembersMap] = useState({});
  const [treesList, setTreesList] = useState([]);
  const [showTreesList, setShowTreesList] = useState(false);
  const [loader, setLoader] = useState({ show: false, text: "" });

  const treeRef = useRef(null);
  const unsubscribeMembersSnapshot = useRef(null);
  const unsubscribeUserSnapshot = useRef(null);

  const hasUserInfo = Object.keys(user).length > 0;
  const hasTreeAtleastOneMember = Object.keys(membersMap).length > 0;

  const getTrees = async () => {
    const treesRef = query(collection(db, getTreesCollectionPath()));
    const treesSnaps = await getDocs(treesRef);
    const trees = [];
    treesSnaps.forEach((treeDoc) => {
      const { tree_name } = treeDoc.data();
      trees.push({ id: treeDoc.id, tree_name });
    });
    setTreesList(trees);
  }

  const getActiveTreeName = async () => {
    const docRef = doc(db, await getActiveTreeDocPath());
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { tree_name } = docSnap.data();
      setActiveTree({ id: docSnap.id, tree_name });
    }
  }

  const fillTreeMembers = async () => {
    const membersRef = query(collection(db, await getMembersCollectionPath()));
    if (unsubscribeMembersSnapshot.current) { unsubscribeMembersSnapshot.current(); }
    unsubscribeMembersSnapshot.current = onSnapshot(membersRef, (snapshot) => {
      const members = {};
      snapshot.docs.forEach((doc) => {
        const { id } = doc;
        const docData = doc.data();
        const memberData = { id, ...docData };
        if (docData.root_member) {
          setRootMember(memberData);
        }
        members[id] = memberData;
      });
      setMembersMap(members);
    });
  }

  useEffect(() => {
    if (hasUserInfo) {
      if (unsubscribeUserSnapshot.current) { unsubscribeUserSnapshot.current(); }
      unsubscribeUserSnapshot.current = onSnapshot(doc(db, getUserDocPath()), async (docSnap) => {
        if (docSnap.exists()) {
          const { active_tree } = docSnap.data();
          if (active_tree) {
            await getActiveTreeName();
            await getTrees();
            await fillTreeMembers();
          }
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (hasUserInfo) {
      fillTreeMembers();
    }
  }, [user]);

  useEffect(() => {
    addAuthStateObserver(
      (user) => setUser(user),
      () => null /* Signed Out */
    );
  }, []);

  useEffect(() => {
    // Reset hide controls & loader after export
    if (hideControlsBeforeExport) {
      exportAsImage(treeRef.current, "family-tree-1");
      setHideControlsBeforeExport(false);
      setLoader({ show: false, text: "" });
    }
  }, [hideControlsBeforeExport]);


  const handleSignOut = () => {
    if (unsubscribeMembersSnapshot.current) {
      unsubscribeMembersSnapshot.current();
      unsubscribeMembersSnapshot.current = null;
    }
    if (unsubscribeUserSnapshot.current) {
      unsubscribeUserSnapshot.current();
      unsubscribeUserSnapshot.current = null;
    }
    signOut();
  }

  const triggerExport = () => {
    setLoader({ show: true, text: "Exporting image..." });
    setHideControlsBeforeExport(true);
  }

  const handleAddNewTree = () => {
    const treeName = window.prompt('Please give a name for your tree');
    if (treeName) {
      setMembersMap({});
      addANewTree(treeName);
    }
  }

  const handleChangeTree = async (id) => {
    if (id !== activeTree.id) {
      setMembersMap({});
    }
    setActiveTreeUtil(id);
    await getTrees();
    setShowTreesList(false);
  }

  const handleRenameTree = () => {
    const newName = window.prompt('Please give a new name for your tree');
    if (newName) {
      renameTree(activeTree.id, newName);
      setActiveTree({ ...activeTree, tree_name: newName });
    }
  }

  const handleDeleteTree = async (id) => {
    setLoader({ show: true, text: "Deleting tree..." });
    setMembersMap({});
    const newActiveTree = treesList.find((tree) => tree.id !== id);
    setActiveTreeUtil(newActiveTree.id);
    await deleteTree(id);
    await getTrees();
    setShowTreesList(false);
    setLoader({ show: false, text: "" });
  }

  return (
    <div className={styles.rootContainer}>
      {hasUserInfo && user.email && (
        <div>
          <div className={styles.greetingsMsg}>
            <span>
              Hey there!
              <br />
              You are signed in as {user.email}!
            </span>
            <span className={styles.signOutLink} onClick={handleSignOut}>
              Sign Out
            </span>
          </div>
          {!showTreesList && <div className={styles.optionsBtns}>
            <button onClick={handleAddNewTree}>Add a new tree</button>
            {treesList.length > 1 && <button onClick={() => setShowTreesList(true)}>Change/Delete tree</button>}
            <button onClick={handleRenameTree}>Rename tree</button>
            {hasTreeAtleastOneMember && <button onClick={triggerExport}>Export as image</button>}
          </div>}
        </div>
      )}
      {showTreesList && <>
        <div>Change/Delete Tree</div>
        <ul className={styles.treeList}>
          {treesList.map((val) => {
            return (<li key={"tree-name-" + val.id}>
              <span className={styles.treeListName} onClick={() => handleChangeTree(val.id)}>{val.tree_name}</span>
              <span className={styles.treeListDeleteIcon} onClick={() => handleDeleteTree(val.id)}>x</span>
            </li>);
          })}
        </ul>
      </>}
      {!showTreesList && <div className={styles.treeContent} ref={treeRef}>
        <div className={styles.treeName}>{activeTree && activeTree.tree_name}</div>
        {hasTreeAtleastOneMember ? (
          <div className="tf-tree tf-custom">
            <ul>
              <TreeNode data={rootMember} membersMap={membersMap} level={1} hideControls={hideControlsBeforeExport} />
            </ul>
          </div>
        ) : (
          <button onClick={() => setShowAddMemberPopup(true)}>
            Add a member
          </button>
        )}
      </div>}
      <MemberDetailsPopper
        open={showAddMemberPopup}
        onClose={() => setShowAddMemberPopup(false)}
        type="add"
        sourceMember={null}
      />
      {loader.show && <Loader text={loader.text} />}
    </div>
  );
};

export default TreeNodeContainer;
