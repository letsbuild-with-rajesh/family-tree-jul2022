import TreeNode from "./TreeNode";
import DetailsPopper from '../DetailsPopper/DetailsPopper';

const TreeNodeTester = () => {
	/*const nodeData = {
		id: "",
		img_url: "",
		name: 'topABC',
		children: [
			{
				id: "",
				img_url: "",
				name: 'DEF1',
				children: []
			},
			{
				id: "",
				img_url: "",
				name: 'LMN1',
				children: []
			},
			{
				id: "",
				img_url: "",
				name: 'LMN1',
				children: []
			},
			{
				id: "",
				img_url: "",
				name: 'LMN1',
				children: []
			}
		]
	};
	*/

	const nodeData = {
		id: "",
		img_url: "",
		name: 'topABC',
		parent_id: "",
		children: [
			{
				id: "",
				img_url: "",
				name: 'ABC1',
				parent_id: "",
				children: [
					{
						id: "",
						img_url: "",
						name: 'DEF1',
						parent_id: "",
						children: [{
							id: "",
							img_url: "",
							name: 'LMN1',
							parent_id: "",
							children: []
						}]
					},
					{
						id: "",
						img_url: "",
						name: 'DEF2',
						parent_id: "",
						children: []
					}
				]
			},
			{
				id: "",
				img_url: "",
				name: 'ABC2',
				parent_id: "",
				children: []
			},
			{
				id: "",
				img_url: "",
				name: 'ABC3',
				parent_id: "",
				children: []
			},
			{
				id: "",
				img_url: "",
				name: 'ABC4',
				parent_id: "",
				children: [
					{
						id: "",
						img_url: "",
						name: 'DEF3',
						parent_id: "",
						children: [{
							id: "",
							img_url: "",
							name: 'LMN2',
							parent_id: "",
							children: []
						}]
					},
					{
						id: "",
						img_url: "",
						name: 'DEF4',
						parent_id: "",
						children: []
					}
				]
			},
		]
	}

	return <><DetailsPopper/><TreeNode data={nodeData} /></>
}

export default TreeNodeTester