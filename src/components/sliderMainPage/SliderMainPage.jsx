import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./sliderMainPage.module.css";

const images = [
  "/images/slider_icons/CSS3-01.svg",
  "/images/slider_icons/formik.svg",
  "/images/slider_icons/Frame 146.svg",
  "/images/slider_icons/Frame.svg",
  "/images/slider_icons/HTML5-01.svg",
  "/images/slider_icons/JAVASCRIPT Logo.svg",
  "/images/slider_icons/node js logo.svg",
  "/images/slider_icons/PostgreSQL-01.svg",
  "/images/slider_icons/React-01.svg",
  "/images/slider_icons/react-router-svgrepo-com.svg",
  "/images/slider_icons/redux-svgrepo-com.svg",
  "/images/slider_icons/sass-svgrepo-com.svg",
];

const firstRow = images.slice(0, Math.ceil(images.length / 2));
const secondRow = images.slice(Math.ceil(images.length / 2));

const baseSettings = {
  infinite: true,
  speed: 8000,
  slidesToShow: 5,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 0,
  cssEase: "linear",
  arrows: false,
  responsive: [
    {
      breakpoint: 1024,
      settings: { slidesToShow: 4 },
    },
    {
      breakpoint: 768,
      settings: { slidesToShow: 3 },
    },
    {
      breakpoint: 480,
      settings: { slidesToShow: 2 },
    },
  ],
};

const SliderComponent = () => {
  return (
    <div className={styles.sliderWrapper}>
      <div className={styles.sliderRow}>
        <Slider {...baseSettings}>
          {firstRow.map((src, index) => (
            <div key={index} className={styles.sliderItem}>
              <img src={src} alt={`Tech ${index}`} className={styles.sliderImage} />
            </div>
          ))}
        </Slider>
      </div>

      <div className={styles.sliderRowReverse}>
        <Slider
          {...{
            ...baseSettings,
            rtl: true, 
          }}
        >
          {secondRow.map((src, index) => (
            <div key={index} className={styles.sliderItem}>
              <img src={src} alt={`Tech ${index + firstRow.length}`} className={styles.sliderImage} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default SliderComponent;
