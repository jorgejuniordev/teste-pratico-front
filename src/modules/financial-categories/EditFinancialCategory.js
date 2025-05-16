import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import styles from "./FinancialCategories.module.css";

const EditFinancialCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    user_id: user?.id || null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token de autenticação inválido.");
        }

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const response = await api.get(
          process.env.REACT_APP_API_URL + `/financial-categories/${id}`
        );

        const category = response.data;

        // Verifica se a categoria pertence ao usuário
        if (!category.user_id) {
          throw new Error("Não é possível editar categorias do sistema.");
        }

        setFormData({
          name: category.name,
          description: category.description || "",
          user_id: category.user_id,
        });
      } catch (err) {
        console.error("Erro ao carregar categoria:", err);
        setError(
          err.response?.data?.message || "Erro ao carregar categoria financeira"
        );
        if (err.message === "Não é possível editar categorias do sistema.") {
          navigate("/financial-categories");
        }
      } finally {
        setLoadingCategory(false);
      }
    };

    fetchCategory();
  }, [id, navigate]);

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

      await api.patch(
        process.env.REACT_APP_API_URL + `/financial-categories/${id}`,
        formData
      );

      navigate("/financial-categories");
    } catch (err) {
      console.error("Erro ao atualizar categoria:", err);
      setError(
        err.response?.data?.message || "Erro ao atualizar categoria financeira"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingCategory) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingMessage}> Carregando categoria... </div>{" "}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1> Editar Categoria Financeira </h1>{" "}
      </div>
      {error && <div className={styles.errorMessage}> {error} </div>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name"> Nome da Categoria </label>{" "}
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
          <label htmlFor="description"> Descrição </label>{" "}
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
            Cancelar{" "}
          </button>{" "}
          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? "Salvando..." : "Salvar"}{" "}
          </button>{" "}
        </div>{" "}
      </form>{" "}
    </div>
  );
};

export default EditFinancialCategory;
