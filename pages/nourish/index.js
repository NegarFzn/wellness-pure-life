import path from "path";
import fs from "fs/promises";
import Head from "next/head";
import Image from "next/image";
import nourishHeader from "./../../public/images/nourish_header.jpg";
import classes from "./index.module.css";
import NourishList from "../../components/nourish/nourish-list";

function nourishPage(props) {
  const categories = [
    { key: "featured", title: "FEATURED", items: props.featured },
    {
      key: "superfoodSecrets",
      title: "SUPERFOOD SECRETS",
      items: props.superfoodSecrets,
    },
    {
      key: "nutrientEssentials",
      title: "NUTRIENT ESSENTIALS",
      items: props.nutrientEssentials,
    },
    {
      key: "mindfulMeals",
      title: "MINDFUL MEALS",
      items: props.mindfulMeals,
    },
    {
      key: "dailySupplements",
      title: "DAILY SUPPLEMENTS",
      items: props.dailySupplements,
    },
  ];

  return (
    <>
      <Head>
        <title>Nourish | Healthy Eating & Wellness</title>
        <meta
          name="description"
          content="Discover healthy eating tips, nutrition insights, and balanced meal plans. Explore superfoods and mindful eating strategies for better well-being."
        />
      </Head>
      <header className={classes.header}>
        <nav>
          <Image src={nourishHeader} alt="nourish header" fill priority />
        </nav>
      </header>
      <main className={classes["main-content"]}>
        {categories.map((category) => (
          <div key={category.key}>
            {" "}
            <section key={category.key} className={classes.section}>
              <h2 className={classes["left-align"]}>{category.title}</h2>
              <hr />
              <div className={classes["nourish-container"]}>
                <NourishList items={category.items} />
              </div>
            </section>
          </div>
        ))}
      </main>
    </>
  );
}

export async function getStaticProps(context) {
  try {
    const filePath = path.join(process.cwd(), "data", "nourish.json");

    // ✅ Read the JSON file
    const jsonData = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(jsonData);

    if (!data || typeof data !== "object") {
      throw new Error("Invalid or missing nourish.json data.");
    }

    return {
      props: {
        featured: data.featured || [],
        superfoodSecrets: data.superfoodSecrets || [],
        nutrientEssentials: data.nutrientEssentials || [],
        mindfulMeals: data.mindfulMeals || [],
        dailySupplements: data.dailySupplements || [],
      },
      revalidate: 60, // ✅ Refresh data every 60 seconds
    };
  } catch (error) {
    console.error("❌ Error fetching nourish data:", error.message);

    // ✅ Provide default empty arrays to prevent crashes
    return {
      props: {
        featured: [],
        superfoodSecrets: [],
        nutrientEssentials: [],
        mindfulMeals: [],
        dailySupplements: [],
      },
    };
  }
}

export default nourishPage;
