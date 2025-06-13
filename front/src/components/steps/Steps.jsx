import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import styles from "./steps.module.css";

const steps = [
  {
    title: "ШАГ 1",
    text: "Напиши мне: опиши, что тебе нужно (оплата сервиса, перевода в другую страну, работа с криптовалютой).",
  },
  {
    title: "ШАГ 2",
    text: "Мы согласуем детали (сумму, способ перевода, сервис).",
  },
  {
    title: "ШАГ 3",
    text: "Я оплачиваю услугу",
  },
  {
    title: "ШАГ 4",
    text: "Ты получаешь результат в указанные сроки.",
  },
];

const Steps = () => {
  const [index, setIndex] = useState(0);
  const confettiFired = useRef(false);

  const isLastStep = index === steps.length - 1;

  const nextStep = () => {
    if (index < steps.length - 1) {
      setIndex((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (index > 0) {
      setIndex((prev) => prev - 1);
    }
  };

  const resetSteps = () => {
    setIndex(0);
    confettiFired.current = false;
  };

  const fireConfetti = () => {
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
      zIndex: 9999,
    });
    setTimeout(() => {
      confetti({
        particleCount: 150,
        angle: 60,
        spread: 100,
        origin: { x: 0 },
        zIndex: 9999,
      });
      confetti({
        particleCount: 150,
        angle: 120,
        spread: 100,
        origin: { x: 1 },
        zIndex: 9999,
      });
    }, 400);
  };

  useEffect(() => {
    if (isLastStep && !confettiFired.current) {
      fireConfetti();
      confettiFired.current = true;
    }
  }, [isLastStep]);

  return (
    <section className={styles.steps}>
      <div className={styles.sliderContainer}>
        <button
          onClick={prevStep}
          className={styles.arrow}
          disabled={index === 0}
        >
          ←
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className={styles.stepCard}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className={styles.stepNum}>{steps[index].title}</h3>
            <p>{steps[index].text}</p>

            {isLastStep && (
              <motion.div
                className={styles.completeBanner}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                🎉 Все готово! Спасибо за доверие.
                <button className={styles.resetBtn} onClick={resetSteps}>
                  Начать заново
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        <button
          onClick={nextStep}
          className={styles.arrow}
          disabled={isLastStep}
        >
          →
        </button>
      </div>
      <div className={styles.telegramBlock}>
        <img
          src="/images/avatar.jpg"
          alt="Ваш аватар"
          className={styles.avatar}
        />
        <div className={styles.telegramText}>
          <h4>Хочешь всё обсудить лично?</h4>
          <p>Напиши мне в Telegram, и я помогу тебе прямо сейчас.</p>
          <a
            href="https://t.me/yurasokol"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.telegramBtn}
          >
            ✉️ Написать в Telegram
          </a>
        </div>
      </div>
    </section>
  );
};

export default Steps;
