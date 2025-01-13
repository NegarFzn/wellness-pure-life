'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import healthyImg from '../../public/images/healthy.jpg'

import classes from "./slideshow.module.css";

const images = [
  { image: healthyImg, alt: "good feeling" }
];

export default function FoodSlideshow() {
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
          className={index === currentImageIndex ? classes.active : ""}
          alt={image.alt}
        />
      ))}
    </div>
  );
}
