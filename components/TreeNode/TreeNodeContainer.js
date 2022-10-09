import React, { useEffect, useRef, useState } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import TreeNode from "./TreeNode";
import MemberDetailsPopper from "../MemberDetailsPopper";
import { initFirebaseApp } from "../../utils/firebaseSetup";
import {
  addAuthStateObserver,
  signOut,
} from "../../components/LoginAndSignUp/utils";
import { exportAsImage } from "./utils";
import styles from "../../styles/TreeNode.module.scss";

const db = initFirebaseApp();

const TreeNodeContainer = () => {
  const [user, setUser] = useState({});
  const [hideControlsBeforeExport, setHideControlsBeforeExport] = useState(false);
  const [showAddMemberPopup, setShowAddMemberPopup] = useState(false);
  const [rootMember, setRootMember] = useState({});
  const [membersMap, setMembersMap] = useState({});
  const treeRef = useRef(null);

  useEffect(() => {
    if (Object.keys(user).length > 0) {
      const userRef = query(
        collection(db, "users/" + user.uid + "/family-members")
      );
      onSnapshot(userRef, (snapshot) => {
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
  }, [user]);

  useEffect(() => {
    addAuthStateObserver(
      (user) => setUser(user),
      () => null /* Signed Out */
    );
  }, []);

  useEffect(() => {
    if (hideControlsBeforeExport) {
      exportAsImage(treeRef.current, "family-tree-1");
      setHideControlsBeforeExport(false);
    }
  }, [hideControlsBeforeExport]);

  const triggerExport = () => {
    setHideControlsBeforeExport(true);
  }

  const hasTreeAtleastOneMember = Object.keys(membersMap).length > 0;

  return (
    <div className={styles.rootContainer}>
      {Object.keys(user).length > 0 && user.email && (
        <div className={styles.topContent}>
          <div className={styles.greetingsMsg}>
            <span>
              Hey there!
              <br />
              You are signed in as {user.email}!
            </span>
            <span className={styles.signOutLink} onClick={signOut}>
              Sign Out
            </span>
          </div>
          {hasTreeAtleastOneMember && <div className={styles.optionsBtns}>
            <button onClick={triggerExport}>
              Export as image
            </button>
          </div>}
        </div>
      )}
      {hasTreeAtleastOneMember ? (
        <div className={styles.treeContent} ref={treeRef}>
          <TreeNode data={rootMember} membersMap={membersMap} level={1} hideControls={hideControlsBeforeExport} />
        </div>
      ) : (
        <button onClick={() => setShowAddMemberPopup(true)}>
          Start a family tree
        </button>
      )}
      <MemberDetailsPopper
        open={showAddMemberPopup}
        onClose={() => setShowAddMemberPopup(false)}
        type="add"
        sourceMember={null}
      />
    </div>
  );
};

export default TreeNodeContainer;
