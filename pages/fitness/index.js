import path from "path";
import fs from "fs/promises";
import Head from "next/head";
import Image from "next/image";
import fitnessHeader from "./../../public/images/fitness_header.jpg";
import classes from "./index.module.css";
import FitnessList from "../../components/fitness/fitness-list";

function fitnessPage(props) {
  const categories = [
    { key: "featured", title: "FEATURED", items: props.featured },
    { key: "cardio", title: "CARDIO", items: props.cardio },
    {
      key: "resistanceTraining",
      title: "RESISTANCE TRAINING",
      items: props.resistanceTraining,
    },
    {
      key: "restAndRecovery",
      title: "REST AND RECOVERY",
      items: props.restAndRecovery,
    },
    { key: "yoga", title: "YOGA", items: props.yoga },
  ];

  return (
    <>
      <Head>
        <title>Fitness</title>
        <meta
          name="description"
          content="Discover workouts, nutrition tips, and expert advice. Join our fitness community for a healthier, stronger you."
        />
      </Head>
      <header className={classes.header}>
        <nav>
          <Image src={fitnessHeader} alt="fitness header" fill priority />
        </nav>
      </header>
      <main className={classes["main-content"]}>
        {categories.map((category) => (
          <div key={category.key}>
            {" "}
            <h2 className={classes["left-align"]}>{category.title}</h2>
            <hr />
            <div className={classes["fitness-container"]}>
              <FitnessList items={category.items} />
            </div>
          </div>
        ))}
      </main>
    </>
  );
}

export async function getStaticProps(context) {
  try {
    const filePath = path.join(process.cwd(), "data", "fitness.json");

    // ✅ Read the JSON file
    const jsonData = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(jsonData);

    if (!data || typeof data !== "object") {
      throw new Error("Invalid or missing fitness.json data.");
    }

    return {
      props: {
        featured: data.featured || [],
        resistanceTraining: data.resistanceTraining || [],
        yoga: data.yoga || [],
        restAndRecovery: data.restAndRecovery || [],
        cardio: data.cardio || [],
      },
      revalidate: 60, // ✅ Refresh data every 60 seconds
    };
  } catch (error) {
    console.error("❌ Error fetching fitness data:", error.message);

    // ✅ Provide default empty arrays to prevent crashes
    return {
      props: {
        featured: [],
        resistanceTraining: [],
        yoga: [],
        restAndRecovery: [],
        cardio: [],
      },
    };
  }
}

export default fitnessPage;
