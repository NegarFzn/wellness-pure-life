import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gaEvent } from "../../lib/gtag"; // ✅ ADD
import styles from "./AuthorBox.module.css";

export default function AuthorBox() {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);
  const firedRef = useRef(false); // ensures event fires once

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !firedRef.current) {
          firedRef.current = true;
          setIsVisible(true);

          // 👉 Fire analytics
          gaEvent("author_box_view");
          gaEvent("key_author_box_view");

          // 👉 Scroll-depth milestone
          gaEvent("scroll_depth_author_box_reached");
          gaEvent("key_scroll_depth_author_box_reached");
        }
      },
      { threshold: 0.2 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleContactClick = () => {
    gaEvent("author_box_contact_click");
    gaEvent("key_author_box_contact_click");
  };

  return (
    <div
      ref={ref}
      className={`${styles.authorBox} ${styles.fadeIn} ${
        isVisible ? styles.visible : ""
      }`}
    >
      <div className={styles.authorImage}>
        <Image
          src="/images/wellness-avatar.jpg"
          alt="Avatar of the Wellness Pure Life author"
          width={64}
          height={64}
          className={styles.avatar}
        />
      </div>

      <div className={styles.authorInfo}>
        <h3>
          Written by <span>Wellness Pure Life</span>
        </h3>

        <p>
          This little corner of the internet is my gift to anyone searching for
          peace, balance, and gentle guidance.
          <br />
          <br />I write, design, and build everything on{" "}
          <strong>Wellness Pure Life</strong> myself — from the articles you
          read to the code that brings them to life.
        </p>

        <p>
          My hope is simple: that something here makes your day a little
          lighter, your heart a little calmer, or your path a little clearer.
        </p>

        <p>
          <a href="/contact" onClick={handleContactClick}>
            send me a message
          </a>
        </p>
      </div>
    </div>
  );
}
