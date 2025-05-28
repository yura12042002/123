import { useEffect, useState } from "react";
import gsap from "gsap";
import styles from "./flyingIcons.module.css";

const icons = [
  "/images/icons_for_background/354c0b686ae7d4325f6f972e96f8976c.svg",
  "/images/icons_for_background/bug.svg",
  "/images/icons_for_background/CSS3-01.svg",
  "/images/icons_for_background/da1892c21c70e4a823e33a3e92d7c5ac.svg",
  "/images/icons_for_background/db1a9d939ba65c41ac11f786ca9adfca.svg",
  "/images/icons_for_background/figma-svgrepo-com.svg",
  "/images/icons_for_background/formik.svg",
  "/images/icons_for_background/HTML5-01.svg",
  "/images/icons_for_background/JAVASCRIPT Logo.svg",
  "/images/icons_for_background/node js logo.svg",
  "/images/icons_for_background/node js.svg",
  "/images/icons_for_background/PostgreSQL-01.svg",
  "/images/icons_for_background/React-01.svg",
  "/images/icons_for_background/react-router-svgrepo-com.svg",
  "/images/icons_for_background/redux-svgrepo-com.svg",
  "/images/icons_for_background/sass-svgrepo-com.svg",
  "/images/icons_for_background/star.svg",
  "/images/icons_for_background/TYPE SCRIPT LOGO.svg",
  "/images/icons_for_background/webpack_original_logo_icon_146300.svg",
];

const FlyingIcons = ({ show }) => {
  const [activeIcons, setActiveIcons] = useState([]);

  useEffect(() => {
    if (show) {
      const cols = Math.ceil(Math.sqrt(icons.length));
      const rows = Math.ceil(icons.length / cols);
      const gapX = window.innerWidth / (cols + 1);
      const gapY = window.innerHeight / (rows + 1);

      const initialIcons = icons.map((icon, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);

        return {
          id: `icon-${index}`,
          src: icon,
          x: (col + 0.5) * gapX + (Math.random() - 0.5) * 50,
          y: (row + 0.5) * gapY + (Math.random() - 0.5) * 50,
        };
      });

      setActiveIcons(initialIcons);
    }
  }, [show]);

  useEffect(() => {
    if (show) {
      activeIcons.forEach((icon) => {
        const element = document.getElementById(icon.id);
        if (element) {
          gsap.set(element, { x: icon.x, y: icon.y, opacity: 1, scale: 0.5 });

          gsap.to(element, {
            opacity: 1,
            scale: 1,
            duration: 2,
            ease: "power2.out",
            onComplete: () => moveIconSmoothly(element),
          });
        }
      });
    }
  }, [activeIcons, show]);

  const moveIconSmoothly = (element) => {
    const move = () => {
      const randomDirectionX = Math.random() > 0.5 ? 1 : -1;
      const randomDirectionY = Math.random() > 0.5 ? 1 : -1;
      const distanceX = Math.random() * 250 + 50;
      const distanceY = Math.random() * 250 + 50;

      gsap.to(element, {
        x: `+=${randomDirectionX * distanceX}`,
        y: `+=${randomDirectionY * distanceY}`,
        rotation: `+=${Math.random() * 100 - 20}`,
        duration: Math.random() * 2 + 3,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
      });
    };

    move();
  };

  useEffect(() => {
    if (!show) return;

    const updateVisibility = () => {
      activeIcons.forEach((icon) => {
        const iconElement = document.getElementById(icon.id);
        if (!iconElement) return;

        const iconRect = iconElement.getBoundingClientRect();
        const centerX = iconRect.left + iconRect.width / 2;
        const centerY = iconRect.top + iconRect.height / 2;

        const elementsUnderIcon = document.elementsFromPoint(centerX, centerY);

        const isOverlapping = elementsUnderIcon.some(
          (el) =>
            el !== iconElement &&
            el.tagName !== "BODY" &&
            el.tagName !== "HTML" &&
            !el.classList.contains(styles.container) 
        );

        gsap.to(iconElement, {
          opacity: isOverlapping ? 0.2 : 1,
          duration: 0.3,
        });
      });

      requestAnimationFrame(updateVisibility);
    };

    requestAnimationFrame(updateVisibility);
  }, [activeIcons, show]);

  return show ? (
    <div className={styles.container}>
      {activeIcons.map((icon) => (
        <img
          key={icon.id}
          id={icon.id}
          src={icon.src}
          className={styles.icon}
          alt={icon.id}
        />
      ))}
    </div>
  ) : null;
};

export default FlyingIcons;
