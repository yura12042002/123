import { useState, useRef } from "react";
import { Typewriter } from "react-simple-typewriter";
import gsap from "gsap";
import styles from "./welcomeScreen.module.css";
import FlyingIcons from "../flyingIcons/FlyingIcons";
import { useNavigate } from "react-router-dom";

const textLines = [
  "<Добро пожаловать",
  "Я здесь, чтобы поделиться своим опытом",
  "помочь тебе разобраться и стать более уверенным",
  "в этой увлекательной сфере.>",
];

const WelcomeScreen = ({ onEnter }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDestroyed, setIsDestroyed] = useState(false);
  const textRef = useRef(null);
  const containerRef = useRef(null);

  const navigate = useNavigate();

  const handleDestroy = () => {
    const container = containerRef.current;

    gsap.to(container, {
      scale: 0.7,
      opacity: 0,
      filter: "blur(10px)",
      duration: 1.2,
      ease: "power3.out",
      onComplete: () => {
        setIsDestroyed(true);
      },
    });
    navigate("/")
  };

  return (
    <div className={styles.container} ref={containerRef}>
      {!isDestroyed && (
        <div className={styles.typing} ref={textRef}>
          {textLines.map(
            (line, index) =>
              index <= currentIndex && (
                <h2 key={index} className={styles.fadeIn}>
                  <Typewriter
                    words={[line]}
                    cursor={index === currentIndex}
                    cursorStyle={<span className={styles.cursor}>/</span>}
                    typeSpeed={90}
                    delaySpeed={500}
                    onType={() => {
                      if (index === currentIndex) {
                        setTimeout(() => {
                          if (currentIndex < textLines.length - 1) {
                            setCurrentIndex(currentIndex + 1);
                          }
                        }, line.length * 80 + 700);
                      }
                    }}
                  />
                </h2>
              )
          )}
        </div>
      )}
      {!isDestroyed && (
        <button className={styles.enterBtn} onClick={handleDestroy}>
          ДАЛЕЕ
        </button>
      )}
      <FlyingIcons
        show={currentIndex === textLines.length - 1}
        textRef={textRef}
      />
    </div>
  );
};

export default WelcomeScreen;
