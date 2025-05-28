import React from "react";
import style from "./footer.module.css";

const socialLinks = [
  {
    icon: "/images/footer_icons/telegram 1.png",
    url: "https://t.me/yurasokol",
  },
  {
    icon: "/images/footer_icons/Frame 18.svg",
    url: "https://github.com/yura12042002",
  },
];

const Footer = () => {
  return (
    <footer className={style.footer}>
      {socialLinks.map(({ icon, url }) => (
        <a href={url} key={icon} target="_blank" rel="noopener noreferrer">
          <img src={icon} alt="icon" />
        </a>
      ))}
    </footer>
  );
};

export default Footer;
