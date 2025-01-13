import Image from "next/image";
import Link from "next/link";
import classes from "./nourish-item.module.css";

export default function NourishItem(props) {
  const { title, image, summary, id } = props;
  const formattedSummary = summary.replace(", ", "\n");

  return (
    <li className={classes.item}>
      <Image src={`/images/${image}`} alt={title} width={200} height={200} />
      <div>
        <Link href={`/nutrition/${id}`} className={classes.link}>
          <h3>{title}</h3>
          <p>{formattedSummary}</p>
        </Link>
      </div>
    </li>
  );
}
