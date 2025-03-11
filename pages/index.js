import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Modal from "../components/UI/Modal"; // Ensure the correct import path
import classes from "./index.module.css";

export default function Home() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setShowModal(true);
      localStorage.setItem("hasVisited", "true");
    }
  }, []);

  const closeModalHandler = () => {
    setShowModal(false);
  };

  return (
    <>
      <Head>
        <title>Healthy Living - Mind & Body Wellness</title>
        <meta
          name="description"
          content="Achieve a balanced and healthier life with fitness, mindfulness, and nourishing food tips."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
      </Head>

      {/* Modal - Only Shows on First Visit */}
      {showModal && (
        <Modal onClose={closeModalHandler}>
          <div className={classes.modalContent}>
            <h1 className={classes.modalTitle}>
              Elevate Your{" "}
              <span className={classes.highlight}>Mind & Body</span> <br />
              With a Healthier Lifestyle
            </h1>
            <button className={classes.startButton} onClick={closeModalHandler}>
              Get Started
            </button>
          </div>
        </Modal>
      )}

      {/* Home Page Content */}
      <main className={classes.container}>
        <h1 className={classes.title}>
          Elevate Your <span className={classes.highlight}>Mind & Body</span>{" "}
          With a Healthier Lifestyle
        </h1>

        <div className={classes.grid}>
          {/* Fitness Section */}
          <Link href="/fitness" className={classes.card}>
            <Image
              src="/images/fitness.jpg"
              alt="People exercising"
              width={400}
              height={250}
              className={classes.image}
              priority
            />
            <h2>Fitness</h2>
            <p>
              Energize your day with a swift workout. Sculpt your body, feel the
              change. Let’s get moving!
            </p>
          </Link>

          {/* Mindfulness Section */}
          <Link href="/mindfulness" className={classes.card}>
            <Image
              src="/images/mindfulness.jpg"
              alt="Person meditating on grass"
              width={400}
              height={250}
              className={classes.image}
            />
            <h2>Mindfulness</h2>
            <p>
              Find peace through mindfulness. Boost energy, reduce stress, and
              embrace challenges for an energized life.
            </p>
          </Link>

          {/* Nourish Section */}
          <Link href="/nourish" className={classes.card}>
            <Image
              src="/images/nourish.jpg"
              alt="Healthy food on a table"
              width={400}
              height={250}
              className={classes.image}
            />
            <h2>Nourish</h2>
            <p>
              Fuel your life with nourishing food. Embrace vitality, make
              healthier choices, and feel your best.
            </p>
          </Link>
        </div>
      </main>
    </>
  );
}
