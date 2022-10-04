import React, { useEffect, useState } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import TreeNode from "./TreeNode";
import MemberDetailsPopper from "../MemberDetailsPopper";
import { initFirebaseApp } from "../../utils/firebaseSetup";
import {
  addAuthStateObserver,
  signOut,
} from "../../components/LoginAndSignUp/utils";
import styles from "../../styles/TreeNode.module.scss";

const db = initFirebaseApp();

const TreeNodeContainer = () => {
  const [user, setUser] = useState({});
  const [showAddMemberPopup, setShowAddMemberPopup] = useState(false);
  const [rootMember, setRootMember] = useState({});
  const [membersMap, setMembersMap] = useState({});

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

  return (
    <div className={styles.rootContainer}>
      {Object.keys(user).length > 0 && user.email && (
        <div className={styles.userEmail}>
          <span>
            Hey there!
            <br />
            You are signed in as {user.email}!
          </span>
          <span className={styles.signOutLink} onClick={signOut}>
            Sign Out
          </span>
        </div>
      )}
      {Object.keys(membersMap).length > 0 ? (
        <TreeNode data={rootMember} membersMap={membersMap} />
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
