import React from "react";
import style from "./footer.module.css";

const publicFilePaths = [
  "/images/footer_icons/Frame 18.svg",
  "/images/footer_icons/Frame 122.svg",
  "/images/footer_icons/Frame 123.svg",
  "/images/footer_icons/telegram 1.png",
  "/images/footer_icons/Vector.svg",
];

const Footer = () => {
  return (
    <footer className={style.footer}>
      {publicFilePaths.map((icon) => (
        <a href="#123" key={icon}>
          <img src={icon} alt="icon" />
        </a>
      ))}
    </footer>
  );
};

export default Footer;
