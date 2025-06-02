import React, { useEffect, useRef, useState } from "react";
import styles from "./codeScatter.module.css";

const codeLines = [
  "01 | // Импортируем React и хуки состояния",
  "02 | import React, { useState, useEffect, useReducer } from 'react';",
  "03 | import axios from 'axios';",
  "04 | import { useNavigate } from 'react-router-dom';",
  "",
  "06 | // Сохраняем данные из формы регистрации",
  "07 | const [formData, setFormData] = useState({",
  "08 |   email: '', password: '', confirmPassword: ''",
  "09 | });",
  "",
  "11 | // Проверяем, совпадают ли пароли",
  "12 | if (formData.password !== formData.confirmPassword) {",
  "13 |   throw new Error('Пароли не совпадают');",
  "14 | }",
  "",
  "16 | // Отправляем данные на сервер",
  "17 | axios.post('/api/register', formData);",
  "",
  "19 | // Используем популярные технологии",
  "20 | const techStack = ['React', 'Redux Toolkit', 'TypeScript', 'SCSS', 'Node.js'];",
  "",
  "22 | // Конфигурируем форму регистрации",
  "23 | const handleSubmit = (e) => {",
  "24 |   e.preventDefault();",
  "25 |   axios.post('/api/signup', formData);",
  "26 | };",
  "",
  "28 | // Подключаем глобальное состояние через useReducer",
  "29 | const [state, dispatch] = useReducer(reducer, initialState);",
  "",
  "31 | // Получаем данные пользователя при загрузке",
  "32 | useEffect(() => { axios.get('/api/me').then(setUser); }, []);",
  "",
  "34 | // Загружаем датасет для анализа",
  "35 | const dataset = await fetch('https://api.example.com/data').then(res => res.json());",
  "",
  "37 | // Выделяем признаки и ответы из данных",
  "38 | const features = dataset.map(d => [d.age, d.income]);",
  "39 | const labels = dataset.map(d => d.purchased);",
  "",
  "41 | // Строим модель нейросети (2 признака → 1 ответ)",
  "42 | const model = tf.sequential();",
  "43 | model.add(tf.layers.dense({ units: 1, inputShape: [2], activation: 'sigmoid' }));",
  "",
  "45 | // Компилируем модель (оптимизатор + функция потерь)",
  "46 | model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });",
  "",
  "48 | // Обучаем модель на данных",
  "49 | await model.fit(tf.tensor2d(features), tf.tensor1d(labels), { epochs: 10 });",
  "",
  "51 | // Cypress-тест проверяет форму",
  "52 | describe('Registration', () => {",
  "53 |   it('shows error on mismatched passwords', () => {",
  "54 |     cy.get('input[name=password]').type('1234');",
  "55 |     cy.get('input[name=confirmPassword]').type('4321');",
  "56 |     cy.get('form').submit();",
  "57 |     cy.contains('Пароли не совпадают');",
  "58 |   });",
  "59 | });",
];

const MAX_LINES = 30;
const LINE_HEIGHT = 22;

const CodeBackground = () => {
  const canvasRef = useRef();

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const CHAR_SPEED = isMobile ? 2 : 30;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.font = "16px Courier New";
    ctx.fillStyle = "lime";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 2;

    let lines = [];
    let lineIndex = 0;
    let charIndex = 0;

    const draw = () => {
      const now = Date.now();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentText = codeLines[lineIndex].slice(0, charIndex);
      ctx.globalAlpha = 1;
      ctx.fillText(currentText, 20, LINE_HEIGHT * lines.length + LINE_HEIGHT);

      lines.forEach((line, i) => {
        const age = now - line.time;
        const opacity = 1;
        if (opacity > 0) {
          ctx.globalAlpha = opacity;
          ctx.fillText(line.text, 20, LINE_HEIGHT * i + LINE_HEIGHT);
        }
      });

      ctx.globalAlpha = 1;

      charIndex++;
      if (charIndex > codeLines[lineIndex].length) {
        lines.push({ text: codeLines[lineIndex], time: now });
        if (lines.length > MAX_LINES) lines.shift();
        lineIndex = (lineIndex + 1) % codeLines.length;
        charIndex = 0;
      }

      setTimeout(() => requestAnimationFrame(draw), CHAR_SPEED);
    };

    draw();
  }, []);

  return <canvas ref={canvasRef} className={styles.codeCanvas} />;
};

export default CodeBackground;
