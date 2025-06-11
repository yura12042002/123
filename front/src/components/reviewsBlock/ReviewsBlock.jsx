import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ReviewsBlock.module.css";

const getStars = (count) => {
  return Array(5)
    .fill(0)
    .map((_, i) =>
      i < count
        ? `<span class="${styles.star} ${styles.filled}">★</span>`
        : `<span class="${styles.star}">☆</span>`
    )
    .join("");
};

const ReviewsCode = ({ reviews }) => {
  const [visibleReviews, setVisibleReviews] = useState([]);
  const [typingIndex, setTypingIndex] = useState(0);

  useEffect(() => {
    if (typingIndex < reviews.length) {
      const timeout = setTimeout(() => {
        setVisibleReviews((prev) => [...prev, reviews[typingIndex]]);
        setTypingIndex((prev) => prev + 1);
      }, 700); // скорость появления одного отзыва
      return () => clearTimeout(timeout);
    }
  }, [typingIndex, reviews]);

  return (
    <div className={styles.container}>
      <div className={styles.tab}>reviews.js</div>
      <pre className={styles.codeBlock}>
        <code>
          <span className={styles.keyword}>const</span>{" "}
          <span className={styles.variable}>reviews</span>{" "}
          <span className={styles.operator}>=</span>{" "}
          <span className={styles.bracket}>[</span>
          <AnimatePresence>
            {visibleReviews.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={styles.review}
              >
                <div className={styles.reviewRow}>
                  <div
                    className={styles.stars}
                    dangerouslySetInnerHTML={{
                      __html: getStars(r.rating || 5),
                    }}
                  />
                  <span className={styles.comment}>
                    {" //"} отзыв от {r.name}
                  </span>
                </div>
                <div className={styles.reviewRow}>
                  <img className={styles.avatar} src={r.img} alt={r.name} />
                  <div className={styles.reviewContent}>
                    <span>{`  {`}</span>
                    <span>
                      {"    "}
                      <span className={styles.key}>name</span>
                      <span className={styles.operator}>: </span>
                      <span className={styles.string}>"{r.name}"</span>,
                    </span>
                    <span>
                      {"    "}
                      <span className={styles.key}>date</span>
                      <span className={styles.operator}>: </span>
                      <span className={styles.string}>"{r.date}"</span>,
                    </span>
                    <span>
                      {"    "}
                      <span className={styles.key}>text</span>
                      <span className={styles.operator}>: </span>
                      <span className={styles.string}>
                        "{r.text.replace(/"/g, '\\"')}"
                      </span>,
                    </span>
                    <span>{`  },`}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <span className={styles.bracket}>];</span>
        </code>
      </pre>
    </div>
  );
};

export default ReviewsCode;
