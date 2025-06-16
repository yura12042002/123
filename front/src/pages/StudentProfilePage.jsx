import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudentProfilePage.module.css";
import axios from "axios";

const StudentProfilePage = () => {
  const [sessionTime, setSessionTime] = useState(0);
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();

  const [resources] = useState([
    { title: "JS Learn", url: "https://learn.javascript.ru/" },
    { title: "MDN Web Docs", url: "https://developer.mozilla.org/" },
    { title: "Frontend Mentor", url: "https://www.frontendmentor.io/" },
    { title: "Codewars", url: "https://www.codewars.com/" },
    { title: "React Docs", url: "https://react.dev/" },
  ]);

  const [skills] = useState([
    { name: "HTML", level: 90 },
    { name: "CSS", level: 75 },
    { name: "JavaScript", level: 65 },
    { name: "React", level: 50 },
  ]);

  const [lessons] = useState([
    { date: "2025-06-11", topic: "Циклы в JavaScript" },
    { date: "2025-06-09", topic: "Функции и области видимости" },
    { date: "2025-06-07", topic: "Основы CSS Flexbox" },
  ]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://167.99.124.169:5000/api/students/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStudent(res.data.data))
      .catch((err) => console.error("Ошибка загрузки профиля:", err));

    const start = Date.now();
    const interval = setInterval(() => {
      setSessionTime(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleBackToMain = () => {
    navigate("/");
  };

  if (!student) {
    return <div className={styles.loading}>⏳ Загружаем профиль ученика...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>👨‍🎓 Профиль ученика</h1>
          <p className={styles.sessionTime}>⏱ Время на сайте: {sessionTime} сек</p>
        </div>
        <div className={styles.status}>
          <span className={styles.badge}>Активен</span>
          <button className={styles.backBtn} onClick={handleBackToMain}>
            ← На главную
          </button>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </header>

      <section className={styles.profileSection}>
        <div className={styles.avatar}></div>
        <div className={styles.info}>
          <h2 className={styles.name}>{student.firstName} {student.lastName}</h2>
          <p><strong>Возраст:</strong> {student.age} лет</p>
          <p><strong>Электронная почта:</strong> {student.email}</p>
          <p><strong>Telegram:</strong> @{student.telegram}</p>
        </div>
        <div className={styles.progress}>
          <h3>📈 Прогресс</h3>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: "40%" }}></div>
          </div>
          <p>4 из 10 заданий выполнено</p>
        </div>
      </section>

      <section className={styles.skills}>
        <h3>🛠 Навыки</h3>
        <ul>
          {skills.map((skill, i) => (
            <li key={i} className={styles.skillItem}>
              {skill.name}
              <div className={styles.skillBar}>
                <div className={styles.skillFill} style={{ width: `${skill.level}%` }}></div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.lessons}>
        <h3>📅 История занятий</h3>
        <ul>
          {lessons.map((lesson, i) => (
            <li key={i}>
              <strong>{lesson.date}</strong>: {lesson.topic}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.nextTask}>
        <h3>🧩 Ближайшее задание</h3>
        <p><strong>Задание:</strong> Сделать ToDo на React с сохранением в localStorage</p>
        <p><strong>Срок:</strong> до 15 июня</p>
      </section>

      <section className={styles.motivation}>
        <blockquote>
          <p>“Каждый эксперт был когда-то новичком. Не останавливайся.”</p>
        </blockquote>
      </section>

      <section className={styles.resources}>
        <h3>📚 Полезные ресурсы</h3>
        <ul className={styles.resourceList}>
          {resources.map((res, i) => (
            <li key={i}>
              <a href={res.url} target="_blank" rel="noreferrer">
                {res.title} ↗
              </a>
            </li>
          ))}
        </ul>
      </section>

      <footer className={styles.footer}>
        <p>Сделано с ❤️ для развития учеников</p>
        <small>Сегодня: {new Date().toLocaleDateString()}</small>
      </footer>
    </div>
  );
};

export default StudentProfilePage;
