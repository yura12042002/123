import React, { useEffect, useRef, useState } from "react";
import styles from "./backGroundTurism.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Lenis from "@studio-freight/lenis";

const LandingLoFi = () => {
  const [isModalOpen, setIsModalOpen] = useState(null);
  const [videoSrc, setVideoSrc] = useState("/videos/bg1.mp4");

  const closeModal = () => setIsModalOpen(null);

  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 5;
    video.playbackRate = 0.75;

    const handleTimeUpdate = () => {
      if (video.currentTime >= 45) {
        video.currentTime = 10;
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setVideoSrc(
        window.innerWidth <= 768 ? "/videos/bg1.mp4" : "/videos/bg1.mp4"
      );
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.load();

    const handleLoaded = () => {
      video.currentTime = 5;
      video.playbackRate = 0.75;
      video.play().catch((err) => {
        console.warn("Автозапуск отклонён:", err);
      });
    };

    video.addEventListener("loadeddata", handleLoaded);
    return () => {
      video.removeEventListener("loadeddata", handleLoaded);
    };
  }, [videoSrc]);

  const [isVideo, setIsVideo] = useState(true);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setIsVideo((prev) => !prev);
  //   }, 5000); // каждые 20 секунд

  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    document.body.style.overflow = "auto";
    document.body.style.scrollbarWidth = "none"; // Firefox
    document.body.style.overscrollBehavior = "none";

    const style = document.createElement("style");
    style.innerHTML = `
    ::-webkit-scrollbar {
      display: none;
    }
  `;
    document.head.appendChild(style);

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.scrollbarWidth = "";
      document.body.style.overscrollBehavior = "";
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.2,

      lerp: 0.04, 

      wheelMultiplier: 0.6, 

      touchMultiplier: 0.6, 
      smoothTouch: true,

      easing: (t) => 1 - Math.pow(1 - t, 4),
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <div className={styles.wrapper}>
      
      {isVideo ? (
        <video
          ref={videoRef}
          className={styles.videoBackground}
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={videoSrc} type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>
      ) : (
        <img
          src="/videos/bg5.png"
          alt="Фоновое изображение"
          className={styles.videoBackground}
        />
      )}

      <div className={styles.overlay}></div>

      <section className={styles.container}>
        <h1 className={styles.title}>
          мини-тур в Добрянку
        </h1>

        <p className={styles.lead}>
          Тур с проживанием в Добрянке на 1–3 дня: сапы утром и вечером, лес
          вокруг, чай, прогулки и никакой спешки.
        </p>

        {/* ─── Почему Добрянка ─────────────────────────────── */}
        <div className={styles.section}>
          <h2 className={styles.subtitle}>Почему именно Добрянка</h2>
          <ul className={styles.list}>
            <li>
              Сосновый бор у самой воды — воздух пахнет смолой и свежестью.
            </li>
            <li>
              Тихие заводи Камы и зеркальный пруд — идеальны для медленных
              маршрутов.
            </li>
            <li>
              Набережная, парк и старые улочки.
            </li>
            <li>Всего час от Перми — близко, но ощущается как другой мир.</li>
          </ul>
        </div>

        {/* ─── Почему сапы ────────────────────────────────── */}
        <div className={styles.section}>
          <h2 className={styles.subtitle}>Что дарят сапы</h2>
          <ul className={styles.list}>
            <li>
              Лёгкий старт — встанет даже новичок.
            </li>
            <li>
              Полная тишина: доска скользит без мотора, слышно только шорох
              воды.
            </li>
            <li>
              Вид с уровня воды: сосны отражаются в глади, кадры будто из
              журнала.
            </li>
            <li>
              Мягкая нагрузка: тело работает, а голова по-настоящему отдыхает.
            </li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.subtitle}>Формат и стоимость</h2>
          <ul className={styles.list}>
            <li>
              <strong>2 500 ₽</strong> с человека в сутки — всё включено
            </li>
            <li> Проживание 1 / 2 / 3 дня в просторной квартире</li>
            <li> Прогулки на сапах каждый день</li>
            <li> Группы до 4 человек или индивидуально</li>
            <li>Полное сопровождение: покажу, объясню — подходит новичкам</li>
            <li> Травяной чай и душевная атмосфера</li>
            <li> Костёр и походный ужин — по погоде и желанию</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.subtitle}>Кому подойдёт</h2>
          <p className={styles.paragraph}>
            Тем, кто хочет выдохнуть. Тем, кто не ищет экстрим, а тянется к
            покою. Тем, кто ценит простоту и воду.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.subtitle}>Как добраться</h2>

          <p className={styles.paragraph}>
            Из Перми до Добрянки можно доехать несколькими способами. Я подскажу
            — выбирай, как удобнее:
          </p>

          <ul className={styles.list}>
            <br></br>
            <li>
              🚌 <strong>Автобус №170</strong> — отправляется с автовокзала
              Перми. Ехать ~1 ч. 10 мин до улицы Советская в Добрянке.
              <br />
              📍 Встречу лично у остановки.
            </li>
            <br></br>
            <br></br>
            <li>
              🚖 <strong>Яндекс Такси (Межгород)</strong> — удобно, если вы
              едете компанией. По предзаказу цена ниже — от 1054 ₽.
            </li>
            <br></br>
          </ul>

          <p className={styles.paragraph}>
            Ниже — примеры маршрута и стоимости поездки:
          </p>

          <div className={styles.imageGallery}>
            <img
              src="/images/5278312651719572195.jpg"
              alt="Маршрут из Перми в Добрянку"
            />
            <img
              src="/images/5278312651719572194.jpg"
              alt="Стоимость такси Яндекс"
            />
            <img
              src="/images/5278312651719572197.jpg"
              alt="Стоимость такси Яндекс"
            />
          </div>
        </div>
        <div className={styles.section}>
          <h2 className={styles.subtitle}>Маршруты прогулок</h2>
          <p className={styles.paragraph}>
            три направления для прогулок — от коротких уединённых до длительных
            с переменой пейзажей. Все маршруты спокойные и доступны для
            новичков. Просто выбери, что тебе ближе — тишина соснового бора,
            звуки леса у устья реки или долгий путь по зеркальной глади воды.
          </p>
          <button
            className={styles.photoButton}
            onClick={() => setIsModalOpen("routes")}
          >
            Смотреть маршруты на карте
          </button>
        </div>

        <div className={styles.section}>
          <h2 className={styles.subtitle}>Место встречи</h2>
          <p className={styles.paragraph}>
            Встречаемся у берега Камы, недалеко от улицы Советская в Добрянке.
            Это удобное место — сюда легко добраться на автобусе или такси. Я
            подойду заранее и встречу вас, чтобы всё прошло спокойно и без
            спешки.
          </p>

          <div className={styles.mapContainer}>
            <iframe
              title="Место встречи — Добрянка"
              src="https://yandex.ru/map-widget/v1/?ll=56.396017%2C58.456574&z=16&pt=56.396017,58.456574,pm2rdl"
              width="100%"
              height="300"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.subtitle}>Мгновения с воды</h2>
          <button
            className={styles.photoButton}
            onClick={() => setIsModalOpen("photos")}
          >
            Посмотреть фото с прогулок
          </button>
        </div>
        {isModalOpen === "routes" && (
          <div className={styles.modalOverlay} onClick={closeModal}>
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <Swiper
                modules={[Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                pagination={{ clickable: true }}
                className={styles.gallerySwiper}
              >
                <SwiperSlide>
                  <img
                    src="/images/maps/1.jpg"
                    alt="Сосновый бор"
                    className={styles.sliderImage}
                  />
                  <p className={styles.caption}>
                    <strong>Маршрут: Сосновый бор</strong> — подходит для
                    спокойной прогулки вдоль берега. Тихая вода, зелёные берега
                    и лёгкий ветер делают маршрут идеальным для утреннего
                    времени. Это отличный вариант для тех, кто хочет
                    почувствовать природу, не удаляясь далеко от города.
                  </p>
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="/images/maps/2.jpg"
                    alt="Устье Добрянки"
                    className={styles.sliderImage}
                  />
                  <p className={styles.caption}>
                    <strong>Маршрут: Вдоль реки Кама + реки Тюзь</strong> —
                    маршрут для тех, кто ищет уединение и смену пейзажа. Вода
                    здесь особенно спокойная, а звуки леса и пение птиц
                    сопровождают на всём пути.
                  </p>
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="/images/maps/3.jpg"
                    alt="Пруд и река"
                    className={styles.sliderImage}
                  />
                  <p className={styles.caption}>
                    <strong>Маршрут: Пруд и река Добрянка</strong> — наиболее
                    длительный маршрут, который включает в себя проход через
                    пруд и реку. Идеален для тех, кто хочет насладиться разными
                    пейзажами: от просторных водных поверхностей до узких речных
                    изгибов. Путь спокойный, но продолжительный — оставляет
                    время для размышлений и наслаждения моментом.
                  </p>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        )}

        <div className={styles.section}>
          <h2 className={styles.subtitle}>Контакт</h2>
          <p className={styles.paragraph}>
            Если хочешь узнать подробности — пиши в Telegram:{" "}
            <a
              href="https://t.me/SupDobrBot"
              target="_blank"
              rel="noreferrer"
            >
              @SupDobrBot
            </a>
            <br />
            Тебя встретит бот — он поможет разобраться с маршрутами, временем и
            ценой. Если появятся вопросы или нужна помощь — я подключусь лично.
          </p>
        </div>

        <div className={styles.footerNote}>
          <p>
            Если думаешь, что «надо бы выбраться на природу» — это может быть
            тот самый день. Увидимся у Камы.
          </p>
        </div>

        {isModalOpen === "photos" && (
          <div className={styles.modalOverlay} onClick={closeModal}>
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <Swiper
                modules={[Pagination, Autoplay]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                spaceBetween={20}
                slidesPerView={1}
                className={styles.gallerySwiper}
              >
                {/* Слайды — те же самые */}
                <SwiperSlide>
                  <img
                    src="/images/sup_slider/6.jpg"
                    alt="Закат на Каме"
                    className={styles.sliderImage}
                  />
                  <p className={styles.caption}>
                    Теплый вечер. Солнце садится за воду. Тишина.
                  </p>
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="/images/sup_slider/5.jpg"
                    alt="Тихий берег"
                    className={styles.sliderImage}
                  />
                  <p className={styles.caption}>
                    Жёлтые деревья вдоль Камы — как будто рисовали акварелью.
                  </p>
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="/images/sup_slider/3.jpg"
                    alt="На сапе"
                    className={styles.sliderImage}
                  />
                  <p className={styles.caption}>
                    Сап и рюкзак — всё, что нужно, чтобы уйти на два часа вглубь
                    себя.
                  </p>
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="/images/sup_slider/8.jpg"
                    alt="Берег осенью"
                    className={styles.sliderImage}
                  />
                  <p className={styles.caption}>
                    Спокойный берег, где начинается маршрут. Трава под ногами,
                    лёгкий ветер с Камы и утки, рассекающие гладь воды. Здесь
                    легко выдохнуть и просто быть.
                  </p>
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="/images/sup_slider/4.jpg"
                    alt="Природа вокруг"
                    className={styles.sliderImage}
                  />
                  <p className={styles.caption}>
                    Место, где можно просто быть. Без спешки.
                  </p>
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="/images/sup_slider/9.jpg"
                    alt="Прогулка вдвоём"
                    className={styles.sliderImage}
                  />
                  <p className={styles.caption}>
                    Если идём вместе — ещё тише. Только вода и дыхание.
                  </p>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default LandingLoFi;
