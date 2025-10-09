"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import bodyImg from "../../public/images/body.jpg";
import fitnessImg from "../../public/images/fitness_02.jpg";
import classes from "./slideshow.module.css";

const images = [
  { image: bodyImg, alt: "Relaxed person enjoying a wellness moment" },
  { image: fitnessImg, alt: "Woman exercising as part of a fitness routine" },
];

export default function BodySlideshow() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex < images.length - 1 ? prevIndex + 1 : 0
      );
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={classes.slideshow}>
      {images.map((image, index) => (
        <Image
          key={index}
          src={image.image}
          alt={image.alt}
          width={1200}
          height={800}
          className={`${classes.image} ${
            index === currentImageIndex ? classes.active : ""
          }`}
          priority={index === 0}
          loading={index === 0 ? "eager" : "lazy"}
        />
      ))}
    </div>
  );
}
