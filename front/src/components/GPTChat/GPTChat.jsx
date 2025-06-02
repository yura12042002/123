import React, { useState } from "react";
import { ChatFeed, Message } from "react-chat-ui";
import styles from "./gptChat.module.css";

const GptChat = () => {
  const [messages, setMessages] = useState([
    new Message({ id: 1, message: "Привет! Я здесь, чтобы помочь ✨" }),
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages((prev) => [
      ...prev,
      new Message({ id: 0, message: newMessage }),
      new Message({ id: 1, message: "GPT думает... (заглушка)" }),
    ]);
    setNewMessage("");
  };

  return (
    <div className={styles.chatWrapper}>
      <div className={styles.chatBox}>
        <ChatFeed
          messages={messages}
          showSenderName
          bubblesCentered={false}
        />
        <div className={styles.inputWrapper}>
          <input
            className={styles.input}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Напиши вопрос..."
          />
          <button onClick={handleSend} className={styles.sendBtn}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default GptChat;
