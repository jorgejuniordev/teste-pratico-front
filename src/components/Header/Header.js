import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Header.module.css";

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.userInfo}>
          <span>Olá, {user?.name}</span>
        </div>
        <div className={styles.headerButtons}>
          <button
            className={styles.headerButton}
            onClick={() => navigate("/dashboard")}
          >
            Lançamentos
          </button>
          <button
            className={styles.headerButton}
            onClick={() => navigate("/financial-summary")}
          >
            Resumo
          </button>
          <button
            className={styles.headerButton}
            onClick={() => navigate("/financial-categories")}
          >
            Categorias
          </button>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
