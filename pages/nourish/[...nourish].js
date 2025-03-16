import Head from "next/head";
import fs from "fs/promises";
import path from "path";
import Content from "../../components/nourish/content";

function NourishDetailPage(props) {
  const { nourishData } = props;

  const maxLength = 20;
  const conciseTitle =
    nourishData.title.length > maxLength
      ? `${nourishData.title.slice(0, maxLength - 3)}...`
      : nourishData.title;

  const pageTitle = `${conciseTitle} | Nourish`;

  return (
    <div>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={nourishData.summary} />
      </Head>
      <Content items={nourishData} />
    </div>
  );
}

async function getData() {
  try {
    const filePath = path.join(process.cwd(), "data", "nourish.json");
    const jsonData = await fs.readFile(filePath, "utf8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("❌ Error reading nourish data:", error.message);
    return null;
  }
}

export async function getStaticProps(context) {
  try {
    if (!context || !context.params) {
      throw new Error("Invalid context: params missing.");
    }

    const { params } = context;
    if (!params.nourish || params.nourish.length === 0) {
      throw new Error("Invalid URL: Nourish ID is missing.");
    }

    const nourishId = params.nourish[0];
    const data = await getData();

    if (!data) return { notFound: true };

    const allItems = Object.values(data).flat();
    const item = allItems.find((item) => item.id === nourishId);

    if (!item) return { notFound: true };

    return {
      props: { nourishData: item },
      revalidate: 60,
    };
  } catch (error) {
    console.error("❌ Error fetching nourish data:", error.message);
    return { notFound: true };
  }
}

export async function getStaticPaths() {
  const data = await getData();

  const paths = [];
  Object.values(data).forEach((category) => {
    category.forEach((item) => {
      paths.push({ params: { nourish: [item.id] } });
    });
  });

  return { paths, fallback: true };
}

export default NourishDetailPage;
