import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./heroSection.module.css";

const reasonsToVisit = [
  "Хочешь изучить JavaScript и React с нуля или подтянуть основы.",
  "Нужна помощь с дипломом, проектом или сложной задачей по фронтенду.",
  "Интересуешься практическим опытом и хочешь пополнить портфолио реальными проектами.",
  "Ищешь наставника, который объясняет просто и по делу, без воды.",
  "Хочешь перейти в IT из другой сферы, но не знаешь, с чего начать.",
  "Уже учишься на курсах, но не хватает поддержки и живых ответов на вопросы.",
  "Нужна помощь перед собеседованием или кодинг-интервью.",
  "Интересуют дополнительные темы: крипта, подписки, техника концентрации, фриланс.",
  "Хочешь не просто учиться, а делать — с понятными задачами и обратной связью.",
  "Ценишь индивидуальный подход и гибкий график занятий.",
];

const HeroSection = () => {
  const [showFunFact, setShowFunFact] = useState(true);
  const [reasonIndex, setReasonIndex] = useState(0);

  useEffect(() => {
    if (!showFunFact) return;

    const changeInterval = setInterval(() => {
      setReasonIndex((prevIndex) => (prevIndex + 1) % reasonsToVisit.length);
    }, 6000);

    return () => clearInterval(changeInterval);
  }, [showFunFact]);

  return (
    <section className={styles.heroSection}>
      <div className={styles.leftBlock}>
        <h1 className={styles.title}>
          Привет! Я Юрий — ментор по фронтенду
        </h1>
        <p className={styles.description}>
          Уже более 1 года и 8 месяцев я помогаю новичкам осваивать HTML, CSS,
          JavaScript и React. Вместе мы создаём реальные проекты, решаем
          практические задачи и готовим портфолио.
        </p>
        <div className={styles.buttons}>
          <Link to="/mentor" className={styles.primaryBtn}>
            МЕНТОРСТВО
          </Link>
          <Link to="/finance" className={styles.secondaryBtn}>
            ОПТЛАТЫ И ПОДПИСКИ
          </Link>
          <Link to="/travel" className={styles.blueBtn}>
            ОФЛАЙН ТУРИЗМ
          </Link>
        </div>
      </div>

      <div className={styles.rightBlock}>
        <img
          src="./images/ava_main.jpg"
          alt="Юрий — наставник"
          className={styles.avatar}
        />
      </div>

      {showFunFact && (
        <div className={styles.funFactBlock}>
          💡 <strong>Зачем может пригодиться мой сайт:</strong>{" "}
          {reasonsToVisit[reasonIndex]}
        </div>
      )}
    </section>
  );
};

export default HeroSection;
