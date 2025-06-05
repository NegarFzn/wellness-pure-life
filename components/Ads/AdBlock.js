import { useEffect } from "react";
import classes from "./AdBlock.module.css";

export default function AdBlock({ adSlot, className = "" }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdsbyGoogle push error:", e);
      }
    }
  }, []);

  const combinedClassName = `${classes.adBlock} ${className}`.trim();

  return (
    <ins
      className={`adsbygoogle ${combinedClassName}`}
      data-ad-client="ca-pub-6324625824043093"
      data-ad-slot={adSlot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
}
