import { LandingPage } from '../components';
import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Racecation</title>
      </Head>
      <main>
        <LandingPage />
      </main>
    </div>
  );
}
