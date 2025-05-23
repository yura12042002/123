import React, { useState } from "react";
import styles from "./studentWork.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { EffectCoverflow } from "swiper/modules";
import { Autoplay } from "swiper/modules";
import { useEffect } from "react";

const works = [
  {
    id: 1,
    title: "Что такое UX/UI-дизайн?",
    preview: "https://mchost.ru/files/img/chto-takoe-uxui-dizajn/image1.jpg",
    full: "https://mchost.ru/files/img/chto-takoe-uxui-dizajn/image1.jpg",
  },
  {
    id: 2,
    title: "Дизайн — обучение",
    preview:
      "https://tse4.mm.bing.net/th?id=OIP.DfBmI8062iLvGwMy-mR_XAHaE8&pid=Api",
    full: "https://tse4.mm.bing.net/th?id=OIP.DfBmI8062iLvGwMy-mR_XAHaE8&pid=Api",
  },
  {
    id: 3,
    title: "UI Design Concepts",
    preview:
      "https://tse1.mm.bing.net/th?id=OIP.raO3501RidMbRwfp8wWrLQHaEY&pid=Api",
    full: "https://tse1.mm.bing.net/th?id=OIP.raO3501RidMbRwfp8wWrLQHaEY&pid=Api",
  },
  {
    id: 4,
    title: "Интерфейс для приложения",
    preview:
      "https://tse2.mm.bing.net/th?id=OIP.0Q3fwvN9U7tKs96TzuQPtwHaFj&pid=Api",
    full: "https://tse2.mm.bing.net/th?id=OIP.0Q3fwvN9U7tKs96TzuQPtwHaFj&pid=Api",
  },
  {
    id: 5,
    title: "Редизайн веб-сайта",
    preview:
      "https://assets.materialup.com/uploads/45fd3be9-2b8c-4cf0-b019-d621be0c31f1/preview.jpg",
    full: "https://assets.materialup.com/uploads/45fd3be9-2b8c-4cf0-b019-d621be0c31f1/preview.jpg",
  },
];

const StudentsWorkFull = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeWork = works[activeIndex];

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.carouselWrapper}>
        <div className={styles.carousel}>
          <Swiper
            direction={ "vertical"}
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
             slidesPerView={isMobile ? "auto" : 3} 
            loop={true}
            speed={4000}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 200,
              modifier: 2 ,
              slideShadows: false,
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            modules={[EffectCoverflow, Autoplay]}
            className={styles.swiper}
          >
            {works.map((work, index) => (
              <SwiperSlide
                key={work.id}
                className={styles.slide}
                style={{
                  display: "flex",
                  justifyContent: "right",
                  alignItems: "center",
                }}
              >
                <div className={styles.card}>
                  <img src={work.preview} alt={work.title} />
                  <p>{work.title}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className={styles.details}>
        <img
          src={activeWork.full}
          alt={activeWork.title}
          className={styles.fullImage}
        />
        <h3>{activeWork.title}</h3>
      </div>
    </div>
  );
};

export default StudentsWorkFull;
