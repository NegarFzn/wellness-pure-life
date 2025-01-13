import Head from "next/head";
import Layout from "../components/layout/layout";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Head>
        <title>Healthy Life</title>
        <meta name="description" content="A website about healthy living." />
        <meta
          name="viewport"
          content="initial-scale=1.0"
          width="device-width"
        />
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
