import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { formatCurrency } from "../../utils/formatters";
import styles from "./NewFinancialEntry.module.css";

const NewFinancialEntry = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    value: "",
    type: "income",
    category_id: "",
    date_entry: new Date().toISOString().split("T")[0],
    user_id: user?.id || null,
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
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
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "value") {
      // Remove all non-numeric characters
      const numericValue = value.replace(/\D/g, "");
      // Convert to number and divide by 100 to get the decimal value
      const decimalValue = numericValue ? Number(numericValue) / 100 : "";
      setFormData((prev) => ({
        ...prev,
        [name]: decimalValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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

      // Prepare the data with proper number conversions
      const dataToSend = {
        ...formData,
        value: Number(formData.value),
        category_id: Number(formData.category_id),
        user_id: Number(user.id),
      };

      await api.post(
        process.env.REACT_APP_API_URL + "/financial-entries",
        dataToSend
      );

      navigate("/dashboard");
    } catch (err) {
      console.error("Erro ao criar lançamento:", err);
      setError(
        err.response?.data?.message || "Erro ao criar lançamento financeiro"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2> Novo Lançamento Financeiro </h2>
        {error && <div className={styles.errorMessage}> {error} </div>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title"> Título </label>{" "}
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="Digite o título do lançamento"
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
              placeholder="Digite a descrição do lançamento"
              rows="4"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="value"> Valor </label>{" "}
            <input
              type="text"
              id="value"
              name="value"
              value={formatCurrency(formData.value)}
              onChange={handleChange}
              required
              placeholder="R$ 0,00"
              className={styles.input}
            />{" "}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="date_entry"> Data do Lançamento </label>{" "}
            <input
              type="date"
              id="date_entry"
              name="date_entry"
              value={formData.date_entry}
              onChange={handleChange}
              required
              className={styles.input}
            />{" "}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="type"> Tipo </label>{" "}
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="income"> Receita </option>{" "}
              <option value="expense"> Despesa </option>{" "}
            </select>{" "}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="category_id"> Categoria </label>{" "}
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id || ""}
              onChange={handleChange}
              required
              className={styles.select}
              disabled={loadingCategories}
            >
              <option value=""> Selecione uma categoria </option>{" "}
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {" "}
                  {category.name}{" "}
                </option>
              ))}{" "}
            </select>{" "}
            {loadingCategories && (
              <span className={styles.loadingText}>
                Carregando categorias...{" "}
              </span>
            )}{" "}
          </div>
          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className={styles.cancelButton}
            >
              Cancelar{" "}
            </button>{" "}
            <button
              type="submit"
              disabled={loading || loadingCategories}
              className={styles.submitButton}
            >
              {loading ? "Salvando..." : "Salvar"}{" "}
            </button>{" "}
          </div>{" "}
        </form>{" "}
      </div>{" "}
    </div>
  );
};

export default NewFinancialEntry;
