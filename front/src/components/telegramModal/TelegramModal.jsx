import React from "react";
import styles from "./TelegramModal.module.css";

const TelegramModal = ({ onClose }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✖
        </button>
        <h2>🤖 Привязка Telegram</h2>
        <p>Для активации входа через Telegram:</p>
        <ol>
          <li>Перейди в Telegram-бота</li>
          <li>
            Нажми <code>/start</code>
          </li>
          <li>Готово — мы узнаем, что ты это ты ✅</li>
        </ol>
        <a
          className={styles.tgLink}
          href="https://web.telegram.org/a/#7237705342"
          target="_blank"
          rel="noopener noreferrer"
        >
          🔗 Перейти к боту
        </a>
      </div>
    </div>
  );
};

export default TelegramModal;
