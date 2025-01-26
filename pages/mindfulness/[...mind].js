import Head from "next/head";
import fs from "fs/promises";
import path from "path";
import Content from "../../components/mindfulness/content";

function mindfulnessDetailsPage(props) {
  const { mindData } = props;

  const maxLength = 15;
  const conciseTitle =
    mindData.title.length > maxLength
      ? `${mindData.title.slice(0, maxLength - 3)}...`
      : mindData.title;

  const pageTitle = `${conciseTitle} | Mindfulness`;

  return (
    <div>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={mindData.description} />
      </Head>
      <Content items={mindData} />
    </div>
  );
}

async function getData() {
  try {
    const filePath = path.join(process.cwd(), "data", "mindfulness.json");
    const jsonData = await fs.readFile(filePath, "utf8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("❌ Error reading mindfulness data:", error.message);
    return null; // ✅ Returns `null` to prevent crashes
  }
}

export async function getStaticProps(context) {
  try {
    const { params } = context;
    const mindfulnessId = params.mind[0];

    const data = await getData();
    if (!data) {
      return { notFound: true };
    }

    const allItems = Object.values(data).flat();
    const item = allItems.find((item) => item.id === mindfulnessId);

    if (!item) {
      return { notFound: true };
    }

    return {
      props: { mindData: item },
      revalidate: 60,
    };
  } catch (error) {
    console.error("❌ Error fetching mindfulness data:", error.message);
    return { notFound: true };
  }
}

export async function getStaticPaths() {
  const data = await getData();

  const paths = [];
  Object.values(data).forEach((category) => {
    category.forEach((item) => {
      paths.push({ params: { mind: [item.id] } });
    });
  });

  return { paths, fallback: true };
}

export default mindfulnessDetailsPage;
