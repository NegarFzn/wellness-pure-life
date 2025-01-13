import Head from "next/head";
import fs from "fs/promises";
import path from "path";
import Content from "../../components/nourish/content";

function nourishDetailsPage(props) {
  const { nourishData } = props;

  const maxLength = 15;
  const conciseTitle =
    nourishData.title.length > maxLength
      ? `${nourishData.title.slice(0, maxLength - 3)}...`
      : nourishData.title;

  const pageTitle = `${conciseTitle} | Nourish`;

  return (
    <div>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={nourishData.description} />
      </Head>
      <Content items={nourishData} />
    </div>
  );
}

async function getData() {
  const filePath = path.join(process.cwd(), "data", "nourish.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);
  return data;
}

export async function getStaticProps(context) {
  const { params } = context;
  const nourishId = params.nourish[0];

  const data = await getData();

  let allItems = [];
  Object.values(data).forEach((category) => {
    allItems = [...allItems, ...category];
  });

  const item = allItems.find((item) => item.id === nourishId);

  if (!item) {
    return { notFound: true };
  }

  return {
    props: {
      nourishData: item,
    },
  };
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

export default nourishDetailsPage;
