import Head from "next/head";
import Layout from "../components/layout/layout";
import { UIProvider } from "../context/UIContext";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <UIProvider>
        <Layout>
          <Head>
            <title>Healthy Life</title>
            <meta
              name="description"
              content="A website about healthy living."
            />
            <meta
              name="viewport"
              content="initial-scale=1.0"
              width="device-width"
            />
          </Head>
          <ToastContainer position="top-center" autoClose={3000} />
          <Toaster position="top-right" reverseOrder={false} />
          <Component {...pageProps} />
        </Layout>
      </UIProvider>
    </SessionProvider>
  );
}

export default MyApp;
