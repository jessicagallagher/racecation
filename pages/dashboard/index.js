import { DashboardHome } from '../../components'
import Head from 'next/head'

export default function Dashboard() {
  return (
    <div>
      <Head>
        <title>My Trips</title>
      </Head>
      <main>
        <DashboardHome />
      </main>
    </div>
  )
}
