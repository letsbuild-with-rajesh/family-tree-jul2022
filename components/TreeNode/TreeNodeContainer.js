import React, { useEffect, useState } from 'react';
import {collection, query, onSnapshot} from "firebase/firestore";
import TreeNode from "./TreeNode";
import {db } from '../../utils/firebaseSetup';
import styles from '../../styles/TreeNode.module.scss';

const TreeNodeContainer = () => {
	const [rootMember, setRootMember] = useState({});
  const [membersMap, setMembersMap] = useState({});

  useEffect(() => {
    const colRef = query(collection(db, 'family-members'))
    onSnapshot(colRef, (snapshot) => {
			const members = {};
      snapshot.docs.forEach(doc => {
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
  },[]);
	
	return (
		<div className={styles.rootContainer}>
			<TreeNode data={rootMember} membersMap={membersMap} />
		</div>
	);
}

export default TreeNodeContainer;