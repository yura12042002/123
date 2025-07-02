import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import styles from "./BookingPage.module.css";
import { useNavigate } from "react-router-dom";

const BookingPage = () => {
  const [range, setRange] = useState({ from: undefined, to: undefined });
  const [bookedRanges, setBookedRanges] = useState([]);
  const [form, setForm] = useState({ name: "", telegram: "", guests: 1 });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooked = async () => {
      try {
        const res = await fetch(
          "http://167.99.124.169:5000/api/bookings/unavailable"
        );
        const data = await res.json();
        const parsed = data.map(({ from, to }) => ({
          from: new Date(from),
          to: new Date(to),
        }));
        setBookedRanges(parsed);
      } catch (error) {
        console.error("Ошибка при загрузке занятых дат:", error);
        setErrorMessage("Не удалось загрузить занятые даты");
      }
    };

    fetchBooked();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!range.from || !range.to) {
      setErrorMessage("Пожалуйста, выберите даты");
      return;
    }

    const diffInDays =
      (range.to.getTime() - range.from.getTime()) / (1000 * 3600 * 24);
    if (diffInDays > 7) {
      setErrorMessage("Максимум можно забронировать на 7 дней");
      return;
    }

    const payload = {
      name: form.name.trim(),
      telegram: form.telegram.trim(),
      guests: Number(form.guests),
      dateFrom: range.from,
      dateTo: range.to,
    };

    console.log(payload)  

    try {
      const res = await fetch("http://167.99.124.169:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "Не удалось создать бронь");
        return;
      }

      setSuccessMessage("Бронь успешно оформлена!");
      setForm({ name: "", telegram: "", guests: 1 });
      setRange({ from: undefined, to: undefined });
    } catch (err) {
      console.error(err);
      setErrorMessage("Произошла ошибка при отправке формы.");
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.calendarSection}>
        <button onClick={() => navigate("/travel")} className={styles.backButton}>
          ← Назад
        </button>
        <DayPicker
          mode="range"
          selected={range}
          onSelect={setRange}
          numberOfMonths={1}
          defaultMonth={new Date()}
          fromDate={new Date()}
          disabled={bookedRanges}
          modifiers={{ booked: bookedRanges }}
          modifiersClassNames={{ booked: styles.booked }}
        />
      </section>

      <section className={styles.infoSection}>
        <div className={styles.contentWrapper}>
          <h1 className={styles.heading}>После сапов — с комфортом</h1>
          <p className={styles.description}>
            Прогулки по Каме, сосновый бор, старинные улочки и набережная. После
            — уютная квартира рядом с точкой старта.
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.formTitle}>Забронировать</h2>

            <input
              type="text"
              name="name"
              placeholder="Ваше имя"
              value={form.name}
              onChange={handleChange}
              required
              className={styles.input}
            />

            <input
              type="text"
              name="telegram"
              placeholder="Ваш Telegram"
              value={form.telegram}
              onChange={handleChange}
              className={styles.input}
            />

            <input
              type="number"
              name="guests"
              min="1"
              max="4"
              placeholder="Количество гостей"
              value={form.guests}
              onChange={handleChange}
              required
              className={styles.input}
            />

            {errorMessage && <div className={styles.error}>{errorMessage}</div>}
            {successMessage && (
              <div className={styles.success}>{successMessage}</div>
            )}

            <button type="submit" className={styles.button}>
              Забронировать
            </button>
          </form>

          <ul className={styles.bullets}>
            <li>До 4 гостей</li>
            <li>Чистое бельё и Wi‑Fi</li>
            <li>Уют, тепло и тишина</li>
            <li>Сразу у точки старта</li>
          </ul>

          <div className={styles.footer}>
            <p>Добрянка, 5 минут от старта на сапах</p>
            <a href="https://t.me/SupDobrBot" target="_blank" rel="noreferrer">
              t.me/SupDobrBot
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BookingPage;
