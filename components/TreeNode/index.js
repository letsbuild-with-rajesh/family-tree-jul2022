import TreeNode from './TreeNode';
import TreeNodeTester from './TreeNodeTester'
import styles from '../../styles/TreeNode.module.scss';

const TreeNodeRootContainer = () => {
	return <div className={styles.rootContainer}>
		<TreeNodeTester />
	</div>
}

export default TreeNodeRootContainer;