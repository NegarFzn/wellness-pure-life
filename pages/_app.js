import { useState, useEffect } from "react";
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
import { useRouter } from "next/router";
import DailyQuiz from "../components/DailyQuiz/DailyQuiz";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  const [showDaily, setShowDaily] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const today = new Date().toISOString().split("T")[0];
    const last = localStorage.getItem("lastDailyShown");
    console.log("Today:", today, "Last shown:", last); // Debug

    if (last !== today) {
      localStorage.setItem("lastDailyShown", today);
      setShowDaily(true);
    }
  }, []);

  return (
    <SessionProvider session={session}>
      <UIProvider>
        <ThemeProvider>
          <Layout>
            {mounted && showDaily && (
              <DailyQuiz onClose={() => setShowDaily(false)} />
            )}

            <Head>
              <title>Wellness Pure Life</title>
              <meta
                name="description"
                content="Discover expert content on fitness, nutrition, and mindfulness to live your healthiest life."
              />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
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
