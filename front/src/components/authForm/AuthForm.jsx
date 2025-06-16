import { useState, useEffect } from "react";
import styles from "./authForm.module.css";
import CodeBackground from "../codeBackground/CodeBackground";
import GptChat from "../GPTChat/GPTChat";
import UserIcon from "../userIcon/UserIcon";
import axios from "axios";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
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
  const navigate = useNavigate();

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
      const { data } = await axios.post(
        "http://167.99.124.169:5000/api/send-code",
        formData
      );

      if (data.success) {
        setStep("verify");
      } else {
        setError(data.error || "Ошибка отправки кода");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Сервер не отвечает");
    }
  };

  useEffect(() => {
    let interval;
    if (step === "verify") {
      interval = setInterval(async () => {
        try {
          const { data } = await axios.get(
            `http://167.99.124.169:5000/api/status/${formData.telegram}`
          );

          if (data.status === "approved") {
            confetti({
              particleCount: 500,
              spread: 360,
              startVelocity: 45,
              gravity: 0.6,
              decay: 0.88,
              scalar: 1.2,
              ticks: 800,
              origin: {
                x: 0.5,
                y: 0.5,
              },
              zIndex: 9999,
            });
            setStep("approved");
            clearInterval(interval);
            document.body.classList.add("fade-out");

            setTimeout(() => {
              navigate("/preview");
            }, 5000);
          }
        } catch (err) {
          console.error("Ошибка проверки статуса:", err);
        }
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [step, formData.telegram]);

  return (
    <div>
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
            <div className={styles.modalContent}>
              <div className={styles.iconWrapper}>📬</div>
              <h3 className={styles.title}>Заявка отправлена</h3>
              <p className={styles.description}>
                Ваша регистрация успешно отправлена администратору.
                <br />
                Ожидайте подтверждения в Telegram. Обычно это занимает 1–2
                минуты.
              </p>
              <div className={styles.loader}></div>
              <p className={styles.subText}>
                Вы получите уведомление после одобрения.
              </p>
            </div>
          </div>
        )}
        {step === "approved" && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.iconWrapper}>🎉</div>
              <h3 className={styles.title}>Поздравляем!</h3>
              <p className={styles.description}>
                Вы успешно зарегистрированы 🎓
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
