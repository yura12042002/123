import React, { useState, useEffect } from "react";
import styles from "./studentWork.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { EffectCoverflow, Autoplay } from "swiper/modules";

// Вставьте ваш массив POROJECTS сюда:
import { PROJECTS } from "../../data/PROJECTS";

const StudentsWorkFull = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = PROJECTS[activeIndex];

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className={styles.header}>
        <h2>Реальные проекты, реальные задачи</h2>
        <p>
          Ниже представлены некоторые работы, выполненные мной или моими
          учениками за последние два года — в рамках курсов, наставничества или
          индивидуального сопровождения. Всего реализовано более 300 проектов,
          но выкладываю их постепенно, по мере возможности.
        </p>
      </div>

      <div className={styles.wrapper}>
        <div className={styles.carouselWrapper}>
          <div className={styles.carousel}>
            <Swiper
              direction="vertical"
              effect="coverflow"
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
                modifier: 2,
                slideShadows: false,
              }}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              modules={[EffectCoverflow, Autoplay]}
              className={styles.swiper}
            >
              {PROJECTS.map((project) => (
                <SwiperSlide
                  key={project.id}
                  className={styles.slide}
                  style={{
                    display: "flex",
                    justifyContent: "right",
                    alignItems: "center",
                  }}
                >
                  <div className={styles.card}>
                    <img src={project.images[0]} alt={project.title} />
                    <p>{project.title}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        <div className={styles.details}>
          <img
            src={activeProject.images[0]}
            alt={activeProject.title}
            className={styles.fullImage}
          />
          <h3>{activeProject.title}</h3>
          <p>{activeProject.description}</p>
          <p>
            <strong>Технологии:</strong> {activeProject.technologies.join(", ")}
          </p>
          <p>
            <strong>Роль:</strong> {activeProject.role}
          </p>
          {activeProject.githubRepo && (
            <a
              href={activeProject.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub →
            </a>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentsWorkFull;
