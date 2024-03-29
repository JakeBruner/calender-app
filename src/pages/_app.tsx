import PropTypes from "prop-types";
import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";

import { trpc } from "../utils/trpc";

import { Inter } from "@next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

import "../styles/globals.css";

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps & { pageProps: { session: Session | null } }) => {
  return (
    <main className={inter.className}>
      <SessionProvider session={session}>
        <Head>
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
        </Head>

        <Component {...pageProps} />
      </SessionProvider>
    </main>
  );
};

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.shape({
    session: PropTypes.object,
  }).isRequired,
};

export default trpc.withTRPC(MyApp);