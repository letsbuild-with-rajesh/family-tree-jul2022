import Head from 'next/head'
import '../utils/firebaseSetup'
import TreeNode from '../components/TreeNode'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Family Tree</title>
        <meta name="description" content="Family Tree App" />
      </Head>
			<TreeNode/>
    </div>
  )
}
