import React, { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coyWithoutShadows } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";

const customStyle = {
  'code[class*="language-"]': {
    background: "transparent",
    color: "#282C34",
    fontFamily:
      "Fira Code, Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    fontSize: "clamp(1rem, 1.4vw, 1.2rem)",
    lineHeight: "1.7",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    padding: "0",
  },
  'pre[class*="language-"]': {
    background: "#fdfdfd",
    padding: "20px",
    borderRadius: "16px",
    overflowX: "auto",
    maxWidth: "100%",
    maxHeight: "80vh",
    border: "1px solid #e1e1e8",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
    position: "relative"
  },
  ".token.keyword": { color: "#d73a49", fontWeight: "bold" },
  ".token.punctuation": { color: "#333" },
  ".token.operator": { color: "#d73a49", fontWeight: "bold" },
  ".token.string": { color: "#22863a", fontWeight: "bold" },
  ".token.comment": { color: "#6a737d", fontStyle: "italic" },
  ".token.parameter": { color: "#005cc5", fontWeight: "bold" },
  "span.line-number": {
    display: "inline-block",
    width: "40px",
    textAlign: "right",
    marginRight: "8px",
    color: "#aaa",
    fontSize: "clamp(0.8rem, 1vw, 1rem)",
    userSelect: "none",
  },
};

const codeLines = [
  "const главная_страница = {",
  '  заголовок: "Фронтенд с нуля до результата",',
  '  подзаголовок: "Онлайн-обучение с практикой и поддержкой",',
  '  призыв: "Первое занятие бесплатно — начни путь уже сегодня",',
  "};",
  "",
  "const блоки = {",
  "  о_менторе: {",
  '    заголовок: "О наставнике",',
  '    содержимое: "1000+ часов опыта, ученики из 5+ стран, фокус на практике",',
  "  },",
  "  как_проходит: {",
  '    заголовок: "Как проходит обучение",',
  "    пункты: [",
  '      "Индивидуальный подход или мини-группа (до 3 человек)",',
  '      "Теория без воды + практика на каждом шаге",',
  '      "Обратная связь по задачам и домашним",',
  "    ],",
  "  },",
  "  темы: {",
  '    заголовок: "Что вы изучите",',
  '    ссылку_ведёт: "к списку тем курса (ниже или на отдельной странице)",',
  "  },",
  "  отзывы: {",
  '    заголовок: "Отзывы учеников",',
  '    формат: "реальные кейсы: от студентов до специалистов из Сбера и стартапов",',
  "  },",
  "  цена: {",
  '    заголовок: "Формат и стоимость",',
  '    текст: "2000 ₽ / 25 $ в час. Первое занятие бесплатно",',
  "  },",
  "  запись: {",
  '    заголовок: "Записаться на бесплатное занятие",',
  "    форма: {",
  '      поля: ["Имя", "Телеграм", "Уровень (начинающий / продолжающий)"],',
  '      кнопка: "Записаться",',
  "    },",
  "  },",
  "};",
  "",
  "const дополнительные_элементы = {",
  '  код_блок: "анимированный блок с кодом о курсе",',
  "  темная_и_светлая_тема: true,",
  '  gif_или_видео: "как проходят уроки / примеры задач",',
  '  навигация: ["Главная", "Отзывы", "Записаться", "Темы курса"],',
  "  футер: {",
  '    соцсети: ["Telegram", "GitHub", "YouTube"],',
  '    подпись: "© Юрий, 2025",',
  "  },",
  "};",
];



const HighlightedCode = () => {
  const [renderedCode, setRenderedCode] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const fullCode = codeLines.join("\n");

  useEffect(() => {
    if (charIndex < fullCode.length) {
      const timer = setTimeout(() => {
        setRenderedCode((prev) => prev + fullCode[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [charIndex]);

  useEffect(() => {
    const blink = setInterval(() => setShowCursor((prev) => !prev), 500);
    return () => clearInterval(blink);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        width: "100%",
        maxWidth: "960px",
      }}
    >
      <SyntaxHighlighter
        language="javascript"
        style={{ ...coyWithoutShadows, ...customStyle }}
        showLineNumbers
        lineNumberStyle={customStyle["span.line-number"]}
      >
        {renderedCode + (showCursor ? "/" : " ") || "// Код загружается..."}
      </SyntaxHighlighter>
    </motion.div>
  );
};

export default HighlightedCode;
