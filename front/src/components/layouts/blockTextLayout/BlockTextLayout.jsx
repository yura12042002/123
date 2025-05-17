import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import style from "./blockTextLayout.module.css";

const BlockTextLayout = ({ layoutText }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [countdown, setCountdown] = useState(5);

  const handleClose = () => {
    setIsVisible(false);
    setCountdown(5);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          setIsVisible(true);
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className={style.wrapper}>
      <AnimatePresence>
        {isVisible ? (
          <motion.div
            className={style.container}
            exit={{ opacity: 0, scale: 1, y: 0 }}
          >
            <div className={style.containerTitle}>
              <h1 className={style.title}>{layoutText.title}</h1>
              <motion.button
                className={style.closeBtn}
                onClick={handleClose}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <img src="./images/main_pictures/close.svg" alt="Закрыть" />
              </motion.button>
            </div>
            <p className={style.mainText}>{layoutText.text}</p>
          </motion.div>
        ) : (
          <motion.div
            className={style.waitScreen}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <h2 className={style.waitText}>Погружаюсь в код...</h2>
            <motion.p
              className={style.timer}
              key={countdown}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {countdown}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlockTextLayout;
