
import { signIn, signOut, useSession } from "next-auth/react";
import Head from 'next/head';

const Home = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <main className="w-full">
      <Head>
        <title>Sign-in</title>
      </Head>
      <h1>Calender</h1>
      {session ? (
        <>
          <p>Signed in as {session.user?.name}</p>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      ) : (
        <>
          <p>Not signed in</p>
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}

    </main>
  );
};

export default Home;