import Head from "next/head";
import fs from "fs/promises";
import path from "path";
import Content from "../../components/fitness/content";


function fitnessDetailsPage(props) {
  const { fitData } = props;

  const maxLength = 15; 
  const conciseTitle = fitData.title.length > maxLength ? `${fitData.title.slice(0, maxLength-3)}...` : fitData.title;

  const pageTitle = `${conciseTitle} | Fitness`;

  return (
    <div>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={fitData.description} />
      </Head>
      <Content items={fitData} />
    </div>
  );
}

async function getData() {
  const filePath = path.join(process.cwd(), "data", "fitness.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);
  return data;
}

export async function getStaticProps(context) {
  const { params } = context;
  const fitnessId = params.fit[0];

  const data = await getData();

  let allItems = [];
  Object.values(data).forEach((category) => {
    allItems = [...allItems, ...category];
  });

  const item = allItems.find((item) => item.id === fitnessId);

  if (!item) {
    return { notFound: true };
  }

  return {
    props: {
      fitData: item,
    },
  };
}

export async function getStaticPaths() {
  const data = await getData();

  const paths = [];
  Object.values(data).forEach((category) => {
    category.forEach((item) => {
      paths.push({ params: { fit: [item.id] } });
    });
  });

  return { paths, fallback: true };
}

export default fitnessDetailsPage;
