import React from "react";
import styles from "./finance.module.css";
import OneMoreTextTitle from "../oneMoreTextTitle/OneMoreTextTitle";
import Steps from "../steps/Steps";
import HelpBlock from "../helpBlock/HelpBlock";
const Finance = () => {
  return (
    <main className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <OneMoreTextTitle
          codeTitleBase={
            "let мне = помочь тебе безопасно и быстро провести платеж"
          }
        />
      </section>

      <HelpBlock />
      

      {/* Benefits */}
      <section className={styles.benefits}>
        <OneMoreTextTitle
          codeTitleBase={" LET МНЕ = ПОКАЗАТЬ РЕАЛЬНЫЕ ПРИМЕРЫ"}
        />
        <div className={styles.galleryGrid}>
          <div className={styles.cardScreen}>
            <img src="/images/money/3cards.jpg" alt="Баланс в Credo Bank" />
            <p>Скриншот моего аккаунта</p>
          </div>
          <div className={styles.cardScreen}>
            <img src="/images/money/zirat.jpg" alt="Баланс в Credo Bank" />
            <p>Скриншот счёта в Ziraat Bank</p>
          </div>
          <div className={styles.cardScreen}>
            <img src="/images/money/payPal.jpg" alt="Активность на Авито" />
            <p>рабочий Paypal аккаунт</p>
          </div>
          <div className={styles.cardScreen}>
            <img src="/images/money/oldPayments.jpg" alt="История транзакций" />
            <p>История успешных переводов</p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className={styles.steps}>
        <OneMoreTextTitle
          codeTitleBase={" LET МНЕ = РАССКАЗАТЬ КАК ЭТО РАБОТАЕТ"}
        />
        <Steps />
      </section>
    </main>
  );
};

export default Finance;
