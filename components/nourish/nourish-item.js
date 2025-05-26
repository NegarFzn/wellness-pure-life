import Image from "next/image";
import Link from "next/link";
import classes from "./nourish-item.module.css";

export default function NourishItem(props) {
  const { title, image, summary, id } = props;
  const shortenSummary = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  };
  
  const formattedSummary = shortenSummary(summary.replace(", ", "\n"));
  

  return (
    <li className={classes.item}>
      <Image
        src={image ? `/images/${image}` : "/images/placeholderNourish.jpg"}
        alt={title}
        width={200}
        height={200}
      />
      <div className={classes.textContainer}>
        <Link href={`/nourish/${id}`} className={classes.link}>
          <h3>{title}</h3>
          <p>{formattedSummary}</p>
        </Link>
      </div>
    </li>
  );
}
