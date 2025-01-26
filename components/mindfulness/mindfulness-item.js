import Image from "next/image";
import Link from "next/link";
import classes from "./mindfulness-item.module.css";

export default function MindfulnessItem(props) {
  const { title, image, summary, id } = props;
  const formattedSummary = summary.replace(", ", "\n");

  return (
    <li className={classes.item}>
      <Image src={image ? `/images/${image}` : "/images/placeholderMind.jpg"} alt={title} width={200} height={200} />
      <div>
        <Link href={`/mindfulness/${id}`} className={classes.link}>
          <h3>{title}</h3>
          <p>{formattedSummary}</p>
        </Link>
      </div>
    </li>
  );
}
