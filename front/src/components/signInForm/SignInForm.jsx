import { useState } from "react";
import styles from "./authForm.module.css";
import CodeBackground from "../codeBackground/CodeBackground";
import GptChat from "../GPTChat/GPTChat";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignInForm = () => {
  const [formData, setFormData] = useState({
    telegram: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/login",
        formData
      );

      if (data.success) {
        localStorage.setItem("token", data.token); // <== сохранить токен
        localStorage.setItem("student", JSON.stringify(data.student)); // <== сохранить профиль
        navigate("/profile");
      } else {
        setError(data.error || "Ошибка входа");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Сервер не отвечает");
    }
  };
  
  return (
    <div className={styles.fullPageWrapper}>
      <CodeBackground />
      <div className={styles.authContainer}>
        <h2 className={styles.title}>Вход</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Telegram:
            <input
              type="text"
              name="telegram"
              value={formData.telegram}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Пароль:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" className={styles.submitBtn}>
            Войти
          </button>
        </form>
      </div>
      <GptChat />
    </div>
  );
};

export default SignInForm;
