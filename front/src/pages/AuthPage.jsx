import React, { useState } from "react";
import styles from "./authPage.module.css";
import CodeBackground from "../components/codeBackground/CodeBackground";
import GptChat from "../components/GPTChat/GPTChat";
import UserIcon from "../components/userIcon/UserIcon";

const AuthPage = () => {
  const [step, setStep] = useState("register");
  const [verificationCode, setVerificationCode] = useState("");

  const [formData, setFormData] = useState({
    telegram: "",
    firstName: "",
    lastName: "",
    age: "",
    avatar: null,
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: name === "avatar" ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegram: formData.telegram }),
      });

      const data = await res.json();
      if (data.success) {
        setStep("verify");
      } else {
        setError(data.error || "Ошибка отправки кода");
      }
    } catch (err) {
      setError("Сервер не отвечает");
    }
  };

  return (
    <>
      <div className={styles.fullPageWrapper}>
        <CodeBackground />
        <div className={styles.authContainer}>
          <h2 className={styles.title}>Регистрация</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label>
              Telegram:{" "}
              <input
                type="text"
                name="telegram"
                value={formData.telegram}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Имя:
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Фамилия:{" "}
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Возраст:{" "}
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Email:{" "}
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Пароль:{" "}
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Повторите пароль:{" "}
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </label>
            {/* <label>
              Аватар:{" "}
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleChange}
              />
            </label> */}
            {error && <div className={styles.error}>{error}</div>}
            <button type="submit" className={styles.submitBtn}>
              Зарегистрироваться
            </button>
          </form>
          <UserIcon isLoggedIn={true} />
        </div>
        <GptChat />
        {step === "verify" && (
          <div className={styles.modal}>
            <div>
              <h3>Введите код из Telegram</h3>
              <input
                type="text"
                placeholder="6-значный код"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <button
                onClick={async () => {
                  const res = await fetch(
                    "http://localhost:5000/api/verify-code",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        telegram: formData.telegram,
                        code: verificationCode,
                      }),
                    }
                  );
                  const data = await res.json();
                  if (data.success) {
                    alert("Успешная регистрация!");
                    setStep("done");
                  } else {
                    setError(data.error || "Неверный код");
                  }
                }}
              >
                Подтвердить
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AuthPage;
