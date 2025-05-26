import { motion } from "framer-motion";
import styles from "./HelpBlock.module.css";

const helpItems = [
  {
    icon: "images/money/car.svg",
    title: "Нужно перевести деньги за границу",
    text: "Банковские переводы не проходят? Я помогу быстро и безопасно отправить средства в любую страну.",
    border: styles.cardPink,
  },
  {
    icon: "images/money/handle.svg",
    title: "Хочешь оплатить зарубежный сервис",
    text: "Netflix, Spotify, ChatGPT, онлайн-курсы — расскажу, как оплатить без российской карты.",
    border: styles.cardYellow,
  },
  {
    icon: "images/money/change.svg",
    title: "Планируешь обмен или работу с криптой",
    text: "Расскажу, где и как выгодно обменять валюту или криптовалюту с минимальными рисками.",
    border: styles.cardBlue,
  },
];

const HelpBlock = () => {
  return (
    <section className={styles.help}>
      <div className={styles.helpCards}>
        {helpItems.map((item, index) => (
          <motion.div
            key={index}
            className={`${styles.card} ${item.border}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div className={styles.iconWrapper}>
              <img src={item.icon} alt="icon" className={styles.icon} />
            </div>
            <div className={styles.text}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HelpBlock;
