import React from "react";
import styles from "./UserIcon.module.css";
import { FaUserCircle } from "react-icons/fa";

const UserIcon = ({ isLoggedIn = false }) => {
  if (!isLoggedIn) return null;

  return (
    <div className={styles.iconWrapper}>
      <FaUserCircle size={28} className={styles.icon} />
      <span className={styles.label}>Вход</span>
    </div>
  );
};

export default UserIcon;
