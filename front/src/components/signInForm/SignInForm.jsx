import { useState, useEffect } from "react";
import styles from "./authForm.module.css";
import CodeBackground from "../codeBackground/CodeBackground";
import GptChat from "../GPTChat/GPTChat";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignInForm = () => {
  const [step, setStep] = useState("login");
  const [formData, setFormData] = useState({ telegram: "", password: "" });
  const [telegramForReset, setTelegramForReset] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loginTelegram, setLoginTelegram] = useState("");
  const [loginCode, setLoginCode] = useState("");

  const navigate = useNavigate();

  // Сброс ошибок при смене шага
  useEffect(() => {
    setError("");
  }, [step]);

  // Проверка статуса восстановления
  useEffect(() => {
    let interval;
    if (step === "waiting" && telegramForReset) {
      interval = setInterval(async () => {
        try {
          const res = await axios.get(
            `http://167.99.124.169:5000/api/check-reset-status/${telegramForReset}`
          );
          if (res.data.status === "approved") {
            setStep("reset");
            clearInterval(interval);
          }
        } catch (err) {
          console.error("Ошибка при проверке статуса восстановления");
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [step, telegramForReset]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://167.99.124.169:5000/api/login",
        formData
      );
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("student", JSON.stringify(res.data.student));
        navigate("/profile");
      } else {
        setError(res.data.error || "Ошибка входа");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Ошибка сервера");
    }
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://167.99.124.169:5000/api/request-password-reset",
        {
          telegram: telegramForReset,
        }
      );
      setStep("waiting");
    } catch (err) {
      setError(err.response?.data?.error || "Не удалось отправить запрос");
    }
  };

  const handleConfirmNewPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://167.99.124.169:5000/api/confirm-new-password", {
        telegram: telegramForReset,
        newPassword,
      });
      alert("Пароль обновлён. Теперь вы можете войти.");
      setStep("login");
      setFormData({ telegram: "", password: "" });
      setTelegramForReset("");
      setNewPassword("");
    } catch (err) {
      setError(err.response?.data?.error || "Ошибка при обновлении пароля");
    }
  };

  return (
    <div className={styles.fullPageWrapper}>
      <CodeBackground />
      <div className={styles.authContainer}>
        <h2 className={styles.title}>
          {step === "login" && "Вход"}
          {step === "forgot" && "Восстановление пароля"}
          {step === "waiting" && "Ожидание подтверждения"}
          {step === "reset" && "Установка нового пароля"}
        </h2>

        {/* Вход */}
        {step === "login" && (
          <form onSubmit={handleLogin} className={styles.form}>
            <label>
              Telegram:
              <input
                type="text"
                name="telegram"
                value={formData.telegram}
                onChange={(e) =>
                  setFormData({ ...formData, telegram: e.target.value })
                }
                required
              />
            </label>
            <label>
              Пароль:
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </label>
            {error && <div className={styles.error}>{error}</div>}
            <button type="submit" className={styles.submitBtn}>
              Войти
            </button>
            <p className={styles.forgotText} onClick={() => setStep("forgot")}>
              Забыли пароль?
            </p>

            <button
              type="button"
              className={styles.altBtn}
              onClick={() => setStep("loginCode")}
            >
              🔐 Войти через Telegram
            </button>
          </form>
        )}

        {/* Запрос на восстановление */}
        {step === "forgot" && (
          <form onSubmit={handleRequestReset} className={styles.form}>
            <label>
              Ваш Telegram (указанный при регистрации):
              <input
                type="text"
                value={telegramForReset}
                onChange={(e) => setTelegramForReset(e.target.value)}
                required
              />
            </label>
            {error && <div className={styles.error}>{error}</div>}
            <button type="submit" className={styles.submitBtn}>
              Запросить восстановление
            </button>
            <p className={styles.backText} onClick={() => setStep("login")}>
              ← Назад ко входу
            </p>
          </form>
        )}

        {/* Ожидание подтверждения */}
        {step === "waiting" && (
          <div className={styles.loaderBlock}>
            <p>⏳ Ожидайте подтверждение администратора в Telegram...</p>
            <div className={styles.loader}></div>
            <p className={styles.backText} onClick={() => setStep("login")}>
              ← Назад ко входу
            </p>
          </div>
        )}

        {/* Установка нового пароля */}
        {step === "reset" && (
          <form onSubmit={handleConfirmNewPassword} className={styles.form}>
            <label>
              Новый пароль:
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </label>
            {error && <div className={styles.error}>{error}</div>}
            <button type="submit" className={styles.submitBtn}>
              Установить пароль
            </button>
          </form>
        )}

        {step === "loginCode" && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await axios.post(
                  "http://167.99.124.169:5000/api/request-login-code",
                  {
                    telegram: loginTelegram,
                  }
                );
                setStep("loginWaiting");
              } catch (err) {
                setError(
                  err.response?.data?.error || "Не удалось отправить код"
                );
              }
            }}
            className={styles.form}
          >
            <label>
              Введите ваш Telegram:
              <input
                type="text"
                value={loginTelegram}
                onChange={(e) => setLoginTelegram(e.target.value)}
                required
              />
            </label>
            {error && <div className={styles.error}>{error}</div>}
            <button type="submit" className={styles.submitBtn}>
              Получить код
            </button>
            <p className={styles.backText} onClick={() => setStep("login")}>
              ← Назад ко входу
            </p>
          </form>
        )}

        {step === "loginWaiting" && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const res = await axios.post(
                  "http://167.99.124.169:5000/api/verify-login-code",
                  {
                    telegram: loginTelegram,
                    code: loginCode,
                  }
                );
                if (res.data.success) {
                  localStorage.setItem("token", res.data.token);
                  localStorage.setItem(
                    "student",
                    JSON.stringify(res.data.student)
                  );
                  navigate("/profile");
                }
              } catch (err) {
                setError(err.response?.data?.error || "Неверный код");
              }
            }}
            className={styles.form}
          >
            <label>
              Введите код из Telegram:
              <input
                type="text"
                value={loginCode}
                onChange={(e) => setLoginCode(e.target.value)}
                required
              />
            </label>
            {error && <div className={styles.error}>{error}</div>}
            <button type="submit" className={styles.submitBtn}>
              Войти
            </button>
            <p className={styles.backText} onClick={() => setStep("login")}>
              ← Назад ко входу
            </p>
          </form>
        )}
      </div>
      <GptChat />
    </div>
  );
};

export default SignInForm;
