import React, { useEffect, useState } from 'react';
import OptionsMenu from '../OptionsMenu';
import styles from '../../styles/TreeNode.module.scss';
import { getRandomColor } from './utils';

const TreeNode = (props) => {
	const { data } = props;
	const childrenCount = data.children.length;

	const [expanded, setExpanded] = useState(true);
	const [randomColor, setRandomColor] = useState({});
	const hasChild = childrenCount > 0;
	const hasMoreThanOneChild = childrenCount > 1;

	useEffect(()=> {
		setRandomColor(getRandomColor());
	}, []);

	return (
		<table className={styles.container}>
			<tbody>
				<tr className={styles.contentContainer}>
					<td className={styles.content} style={randomColor}>
						<div className={styles.picture}><img src="" /></div>
						<div className={styles.contentDescription}>
							<div className={styles.name}>{data.name}</div>
							<div className={styles.buttons}>
								{hasChild && <button className={styles.expandCollapseBtn} onClick={() => setExpanded(!expanded)}>{expanded ? 'Collapse' : 'Expand'}</button>}
								<OptionsMenu />
							</div>
						</div>
					</td>
				</tr>
				{expanded && hasChild && (<>
					<tr className={styles.childrenLineContainer}>
						<td>
							<div className={styles.childrenLine}></div>
						</td>
					</tr>
					{hasMoreThanOneChild && (<tr>
						<td className={styles.rightLine}></td>
						{[...Array(childrenCount - 1).keys()].map((_, id) => {
							return (<React.Fragment key={`${data.name}-children-${id}`}>
								<td className={`${styles.topLine} ${styles.leftLine}`}></td>
								<td className={`${styles.topLine} ${styles.rightLine}`}></td>
							</React.Fragment>);
						})}
						<td className={styles.leftLine}></td>
					</tr>)}
					<tr className={styles.childrenContainer}>
						{data.children.map((val) => {
							return (<td colSpan="2" key={val.name}>
								<TreeNode key={val.name} data={val} />
							</td>);
						})}
					</tr>
				</>)}
			</tbody>
		</table>)
}

export default TreeNode;