import React from "react";
import styles from "./UserIcon.module.css";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UserIcon = ({ isLoggedIn = false }) => {
  const navigate = useNavigate();

  if (!isLoggedIn) return null;

  return (
    <div
      className={styles.iconWrapper}
      onClick={() => navigate("/login")}
      title="Перейти к авторизации"
    >
      <FaUserCircle size={28} className={styles.icon} />
      <span className={styles.label}>Вход</span>
    </div>
  );
};

export default UserIcon;
