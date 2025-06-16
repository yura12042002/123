import React, { useState } from "react";
import ReactPlayer from "react-player";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBookOpen,
  FaTasks,
  FaComments,
  FaToolbox,
  FaVideoSlash,
  FaCalendarCheck,
  FaBitcoin,
  FaEthereum,
  FaRobot,
  FaUsers,
} from "react-icons/fa";
import styles from "./mentorPrivew.module.css";
import BlockTextLayout from "../layouts/blockTextLayout/BlockTextLayout";
import OneMoreTextTitle from "../oneMoreTextTitle/OneMoreTextTitle";

const arr = [
  {
    title: "🔑 Доступ к личному кабинету",
    text: "</ Ты получишь доступ в личный кабинет ученика, где ты будешь получать и выполнять домашнее задание, сможешь пользоваться такими сервисами как редактор кода, песочница и трекер прогресса бесплатно, также тебе будут доступны полезные обучающие материалы по frontend-разработке >",
  },
  {
    title: "📌 Разбор ошибок и практика",
    text: "</ В процессе обучения будем проводить подробный разбор ошибок, которые совершаются начинающими разработчиками, работать на реальных примерах >",
  },
  {
    title: "⏳ Гибкий график и поддержка",
    text: "</ Подберем удобное тебе время для занятий, а также будем поддерживать связь, чтобы я мог отвечать на вопросы и давать ценные рекомендации >",
  },
];

const MentorPrivew = () => {
  const [showModal, setShowModal] = useState(false);
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return (
    <div className={styles.container}>
      <OneMoreTextTitle
        codeTitleBase={`let мне = помочь тебе c frontend разработкой`}
      />

      <motion.div
        className={styles.containerPrev}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <BlockTextLayout layoutText={arr[0]} className={styles.textBlock} />
        <div className={styles.centerBlock}>
          {isAuthenticated && (
            <motion.div
              className={styles.videoWrapper}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <ReactPlayer
                url="videos/Welcome video.mp4"
                width="100%"
                height="100%"
                playing={false}
                controls={true}
                muted={false}
              />
            </motion.div>
          )}

          <motion.button
            className={styles.learnMoreBtn}
            onClick={() => setShowModal(true)}
            whileHover={{
              scale: 1.1,
              boxShadow: "0px 0px 15px rgba(138, 43, 226, 0.8)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            узнать больше о личном кабинете ученика
          </motion.button>
        </div>
      </motion.div>

      <div className={styles.rowTexts}>
        <BlockTextLayout layoutText={arr[1]} />
        <BlockTextLayout layoutText={arr[2]} />
      </div>

      {/* Модалка */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className={styles.modalContent}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>🔐 Что даёт личный кабинет ученика</h2>
              <ul className={styles.featuresList}>
                <li>
                  <FaTasks /> Домашние задания и трекер прогресса
                </li>
                <li>
                  <FaBookOpen /> Интерактивные материалы по HTML, CSS,
                  JavaScript и React
                </li>
                <li>
                  <FaToolbox /> Сервисы: редактор кода, песочницы, чек-листы
                </li>
                <li>
                  <FaComments /> Связь с наставником и разбор ошибок
                </li>
                <li>
                  <FaCalendarCheck /> Индивидуальный график занятий
                </li>
                <li>
                  <FaBitcoin /> Более выгодный курс обмена криптовалюты
                </li>
                {!isAuthenticated && (
                  <li>
                    <FaVideoSlash /> Уроки доступны после регистрации
                  </li>
                )}
                <li>
                  <FaRobot />
                  Обучающий чат-бот на базе ChatGPT
                </li>

                <li>
                  <FaUsers /> Подписка на сервисы доступна всей группе
                </li>
              </ul>

              <button
                className={styles.closeButton}
                onClick={() => setShowModal(false)}
              >
                Закрыть
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MentorPrivew;
