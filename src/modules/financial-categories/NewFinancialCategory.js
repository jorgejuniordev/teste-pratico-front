import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import styles from "./FinancialCategories.module.css";

function NewFinancialCategory() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    user_id: user?.id || null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token de autenticação inválido.");
      }

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await api.post(
        process.env.REACT_APP_API_URL + "/financial-categories",
        formData
      );

      navigate("/financial-categories");
    } catch (err) {
      console.error("Erro ao criar categoria:", err);
      setError(
        err.response?.data?.message || "Erro ao criar categoria financeira"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Nova Categoria Financeira</h1>
      </div>
      {error && <div className={styles.errorMessage}>{error}</div>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Nome da Categoria</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={styles.input}
            placeholder="Digite o nome da categoria"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="Digite a descrição da categoria"
            rows="4"
          />
        </div>
        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={() => navigate("/financial-categories")}
            className={styles.cancelButton}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewFinancialCategory;
