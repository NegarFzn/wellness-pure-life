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
        <title>Nourish</title>
        <meta
          name="description"
          content="Discover expert tips, healthy recipes, and nutrition insights in the Nourish section. Learn how balanced meals and mindful eating can transform your well-being."
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
            <h2 className={classes["left-align"]}>{category.title}</h2>
            <hr />
            <div className={classes["nourish-container"]}>
              <NourishList items={category.items} />
            </div>
          </div>
        ))}
      </main>
    </>
  );
}

export async function getStaticProps(context) {
  const filePath = path.join(process.cwd(), "data", "nourish.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  return {
    props: {
      featured: data.featured,
      superfoodSecrets: data.superfoodSecrets,
      nutrientEssentials: data.nutrientEssentials,
      mindfulMeals: data.mindfulMeals,
      dailySupplements: data.dailySupplements,
    },
    revalidate: 60,
  };
}

export default nourishPage;
