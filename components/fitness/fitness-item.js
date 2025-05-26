import Image from "next/image";
import Link from "next/link";
import classes from "./fitness-item.module.css";

export default function FitnessItem(props) {
  const { title, image, summary, id } = props;
  const formattedSummary = summary.replace(", ", "\n");

  return (
    <li className={classes.item}>
      <Image
        src={image ? `/images/${image}` : "/images/placeholderFit.jpg"}
        alt={title}
        width={200}
        height={200}
        priority={true}
        sizes="(max-width: 768px) 100vw, 100vw"
      />
      <div className={classes.textContainer}>
        <Link href={`/fitness/${id}`} className={classes.link}>
          <h3>{title}</h3>
          <p>{formattedSummary}</p>
        </Link>
      </div>
    </li>
  );
}
