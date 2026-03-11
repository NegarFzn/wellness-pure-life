import { useState, useEffect } from "react";
import Head from "next/head";
import Layout from "../components/layout/layout";
import { UIProvider } from "../context/UIContext";
import { SessionProvider, useSession } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "../context/ThemeContext";
import ChatBox from "../components/ChatBox/ChatBox";
import CookieConsent from "../components/CookieConsent/CookieConsent";
import Script from "next/script";
import { useRouter } from "next/router";
import DailyQuiz from "../components/Quiz/DailyQuiz/DailyQuiz";
import DailyQuizSync from "../components/Quiz/DailyQuiz/DailyQuizSync";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";

// Inner app so we can use useSession() (must be inside SessionProvider)
function AppInner({ Component, pageProps }) {
  const router = useRouter();
  const { status } = useSession();
  const [showDaily, setShowDaily] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // ------- Guest: 30s delayed modal (now skips blocked routes + updates on route change) -------
  useEffect(() => {
    if (typeof window === "undefined") return;

    const BLOCKED = ["/login", "/signup", "/register", "/dashboard"];
    if (BLOCKED.includes(router.pathname)) return;

    const today = new Date().toISOString().split("T")[0];
    const last = localStorage.getItem("lastDailyShown");
    if (last === today) return;

    const timer = setTimeout(() => {
      setShowDaily(true);
      localStorage.setItem("lastDailyShown", today); // mark only when shown
    }, 30000);

    return () => clearTimeout(timer);
  }, [router.pathname]);

  // ------- After login: optionally reopen the quiz (intent-only, smart about guest submission) -------
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (status !== "authenticated") return;

    const intent = localStorage.getItem("openDailyQuizAfterLogin") === "true";
    if (!intent) return;

    localStorage.removeItem("openDailyQuizAfterLogin");

    const today = new Date().toISOString().split("T")[0];
    const hasGuestSubmission = !!localStorage.getItem(`daily-checkin:${today}`);
    if (hasGuestSubmission) return; // let DailyQuizSync handle it silently

    setShowDaily(true);
    localStorage.setItem("lastDailyShown", today); // prevent double open later
  }, [status]);

  return (
    <>
      <Script
        async
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6324625824043093"
        crossOrigin="anonymous"
      />
      {/* Always mounted: posts guest results after login */}
      <DailyQuizSync />

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
    </>
  );
}

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <AppInner Component={Component} pageProps={pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
