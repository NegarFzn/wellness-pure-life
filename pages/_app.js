import Head from "next/head";
import Layout from "../components/layout/layout";
import { UIProvider } from "../context/UIContext";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "../context/ThemeContext";
import ChatBox from "../components/ChatBox/ChatBox";
import CookieConsent from "../components/CookieConsent/CookieConsent";
import Script from "next/script";
import { useEffect } from "react";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      window.gtag("config", "G-BW68Y2E49W", {
        page_path: url,
      });
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);
  return (
    <SessionProvider session={session}>
      <UIProvider>
        <ThemeProvider>
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
            <Script
              async
              strategy="afterInteractive"
              src="https://www.googletagmanager.com/gtag/js?id=G-BW68Y2E49W"
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-BW68Y2E49W');
    `,
              }}
            />

            <ToastContainer position="top-center" autoClose={3000} />
            <Toaster position="top-right" reverseOrder={false} />
            <ChatBox />
            <Component {...pageProps} />
            <CookieConsent />
          </Layout>
        </ThemeProvider>
      </UIProvider>
    </SessionProvider>
  );
}

export default MyApp;
