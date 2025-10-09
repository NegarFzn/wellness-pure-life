import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./AuthorBox.module.css";

export default function AuthorBox() {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

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
          read to the code that brings them to life. It’s not a company. It’s a
          labor of love.
        </p>
        <p>
          My hope is simple: that something here makes your day a little
          lighter, your heart a little calmer, or your path a little clearer.
        </p>
        <p>
          <a href="/contact">send me a message</a> — I’d love to hear from you.
        </p>
      </div>
    </div>
  );
}
