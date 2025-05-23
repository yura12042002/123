import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coyWithoutShadows } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";
import styles from "./mentorPrivew.module.css";
import BlockTextLayout from "../layouts/blockTextLayout/BlockTextLayout";

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

const codeTitleBase = `let мне = помочь тебе c frontend-разработкой!`;

const MentorPrivew = () => {
  const [renderedTitle, setRenderedTitle] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  const [formattedTitle, setFormattedTitle] = useState(codeTitleBase);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      let newTitle = codeTitleBase;

      if (screenWidth < 600) {
        newTitle = `let мне = помочь тебе\n c frontend-разработкой!`;
      } else if (screenWidth < 400) {
        newTitle = `let мне = помочь\n тебе\n c frontend-разработкой!`;
      }

      setFormattedTitle(newTitle);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (charIndex < formattedTitle.length) {
      const timer = setTimeout(() => {
        setRenderedTitle((prev) => prev + formattedTitle[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [charIndex, formattedTitle]);

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.title}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <SyntaxHighlighter
          language="javascript"
          style={coyWithoutShadows}
          customStyle={{
            background: "transparent",
            color: "#282C34",
            fontFamily: "Fira Code, Consolas, Monaco, monospace",
            fontSize: "clamp(1.2rem, 2vw, 1.8rem)",
            lineHeight: "1.6",
            textAlign: "center",
            padding: "10px",
            maxWidth: "90vw",
            margin: "0 auto",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {renderedTitle || "// Загружается..."}
        </SyntaxHighlighter>
      </motion.div>

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
