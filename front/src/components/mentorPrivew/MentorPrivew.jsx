import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coyWithoutShadows } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";
import styles from "./mentorPrivew.module.css";
import BlockTextLayout from "../layouts/blockTextLayout/BlockTextLayout";
import OneMoreTextTitle from "../oneMoreTextTitle/OneMoreTextTitle";

const arr = [
  {
    title: "🔑 Доступ к личному кабинету",
    text: "</ Ты получишь доступ в личный кабинет ученика, где ты будешь получать и выполнять домашнее задание, сможешь пользоваться такими сервисами как (перечислить 2-3 самых важных сервиса) бесплатно, также тебе будут доступны полезные обучающие материалы по frontend-разработке >",
  },
  {
    title: "📌 Разбор ошибок и практика",
    text: "</ В процессе обучения будем проводить подробный разбор ошибок, которые совершаются начинающими разработчиками, работать на реальных примерах>",
  },
  {
    title: "⏳ Гибкий график и поддержка",
    text: "</ Подберем удобное тебе время для занятий, а также будем поддерживать связь, чтобы я мог отвечать на вопросы и давать ценные рекомендации >",
  },
];

const MentorPrivew = () => {
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
          <motion.div
            className={styles.videoWrapper}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* <ReactPlayer
              url="videos/IMG_2187.MOV"
              width="100%"
              height="100%"
              playing={false}
              controls={true}
              loop={true}
              muted={false}
            /> */}
          </motion.div>
          <motion.button
            className={styles.learnMoreBtn}
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
    </div>
  );
};

export default MentorPrivew;
