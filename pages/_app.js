import Head from "next/head";
import Layout from "../components/layout/layout";
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // ✅ important!
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
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
        {/* ✅ react-toastify container */}
        <ToastContainer position="top-center" autoClose={3000} />

        {/* Optional: Keep react-hot-toast too if you use it elsewhere */}
        <Toaster position="top-right" reverseOrder={false} />
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}

export default MyApp;
