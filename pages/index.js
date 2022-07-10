import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Family Tree</title>
        <meta name="description" content="Family Tree App" />
      </Head>
    </div>
  )
}
