import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot } from "firebase/firestore";
import TreeNode from "./TreeNode";
import { initFirebaseApp } from '../../utils/firebaseSetup';
import { addAuthStateObserver, signOut } from '../../components/LoginAndSignUp/utils';
import styles from '../../styles/TreeNode.module.scss';

const db = initFirebaseApp();

const TreeNodeContainer = () => {
	const [userEmail, setUserEmail] = useState('');
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
		addAuthStateObserver(
			(user) => setUserEmail(user.email),
			() => window.location.href = '/login'
		);
	}, []);

	return (
		<div className={styles.rootContainer}>
			{userEmail && (
				<div className={styles.userEmail}>
					<span>Hey there!<br />You are signed in as {userEmail}!</span>
					<span className={styles.signOutLink} onClick={signOut}>Sign Out</span>
				</div>
			)}
			<TreeNode data={rootMember} membersMap={membersMap} />
		</div>
	);
}

export default TreeNodeContainer;