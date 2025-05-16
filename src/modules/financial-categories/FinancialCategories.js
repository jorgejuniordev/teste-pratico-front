import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import Header from "../../components/Header/Header";
import styles from "./FinancialCategories.module.css";

function FinancialCategories() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token de autenticação inválido.");
      }

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await api.get(
        process.env.REACT_APP_API_URL + "/financial-categories"
      );
      setCategories(response.data);
    } catch (err) {
      console.error("Erro ao buscar categorias:", err);
      setError("Erro ao carregar categorias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    navigate("/financial-categories/new");
  };

  const handleEditCategory = (id) => {
    navigate(`/financial-categories/${id}/edit`);
  };

  const handleDeleteCategory = async (id, isSystemCategory) => {
    if (isSystemCategory) {
      alert("Não é possível excluir categorias do sistema.");
      return;
    }

    if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      return;
    }

    try {
      setDeleteLoading(id);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token de autenticação inválido.");
      }

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await api.delete(
        process.env.REACT_APP_API_URL + `/financial-categories/${id}`
      );

      await fetchCategories();
    } catch (err) {
      console.error("Erro ao excluir categoria:", err);
      setError("Erro ao excluir categoria");
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>Categorias Financeiras</h1>
          <button className={styles.addButton} onClick={handleAddCategory}>
            Adicionar Categoria
          </button>
        </div>
        {error && <div className={styles.errorMessage}>{error}</div>}
        {loading ? (
          <div className={styles.loadingMessage}>Carregando categorias...</div>
        ) : (
          <div className={styles.categoriesGrid}>
            {categories.map((category) => (
              <div key={category.id} className={styles.categoryCard}>
                <div className={styles.categoryInfo}>
                  <h3>{category.name}</h3>
                  {category.description && (
                    <p className={styles.categoryDescription}>
                      {category.description}
                    </p>
                  )}
                  <span className={styles.categoryType}>
                    {category.user_id
                      ? "Categoria Personalizada"
                      : "Categoria do Sistema"}
                  </span>
                </div>
                {category.user_id && (
                  <div className={styles.categoryActions}>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEditCategory(category.id)}
                    >
                      Editar
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() =>
                        handleDeleteCategory(category.id, !category.user_id)
                      }
                      disabled={deleteLoading === category.id}
                    >
                      {deleteLoading === category.id
                        ? "Excluindo..."
                        : "Excluir"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FinancialCategories;
