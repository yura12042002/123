import React, { useEffect, useRef } from "react";
import styles from "./CustomCursor.module.css";

const CustomCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const moveCursor = (e) => {
      const { clientX, clientY } = e;

      if (cursorRef.current) {
        cursorRef.current.style.left = `${clientX}px`;
        cursorRef.current.style.top = `${clientY}px`;
      }

      for (let i = 0; i < 7; i++) {
        const drop = document.createElement("div");
        drop.className = styles.waterDrop;

        const angle = Math.random() * 2 * Math.PI;
        const distance = 20 + Math.random() * 20;
        const xOffset = Math.cos(angle) * distance;
        const yOffset = Math.sin(angle) * distance;

        drop.style.left = `${clientX}px`;
        drop.style.top = `${clientY}px`;
        drop.style.setProperty("--x", `${xOffset}px`);
        drop.style.setProperty("--y", `${yOffset}px`);

        document.body.appendChild(drop);

        setTimeout(() => {
          drop.remove();
        }, 800);
      }
    };

    document.addEventListener("mousemove", moveCursor);
    return () => document.removeEventListener("mousemove", moveCursor);
  }, []);

  useEffect(() => {
    document.body.style.cursor = "none";
    return () => {
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={styles.cursor}
      style={{ backgroundImage: 'url("/images/cursor.png")' }}
    ></div>
  );
};

export default CustomCursor;
