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
  const filePath = path.join(process.cwd(), "data", "mindfulness.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);
  return data;
}

export async function getStaticProps(context) {
  const { params } = context;
  const mindfulnessId = params.mind[0];

  const data = await getData();

  let allItems = [];
  Object.values(data).forEach((category) => {
    allItems = [...allItems, ...category];
  });

  const item = allItems.find((item) => item.id === mindfulnessId);

  if (!item) {
    return { notFound: true };
  }

  return {
    props: {
      mindData: item,
    },
  };
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
