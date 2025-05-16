import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { formatCurrency } from "../../utils/formatters";
import styles from "./NewFinancialEntry.module.css";

const EditFinancialEntry = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    value: "",
    type: "income",
    category_id: null,
    date_entry: "",
    user_id: user?.id || null,
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingEntry, setLoadingEntry] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token de autenticação inválido.");
        }

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Fetch categories
        const categoriesResponse = await api.get(
          process.env.REACT_APP_API_URL + "/financial-categories"
        );

        setCategories(categoriesResponse.data);

        // Fetch entry data
        const entryResponse = await api.get(
          process.env.REACT_APP_API_URL + `/financial-entries/${id}`
        );
        const entry = entryResponse.data;

        setFormData({
          title: entry.title,
          description: entry.description || "",
          value: entry.value,
          type: entry.type,
          category_id: entry.category_id,
          date_entry: entry.date_entry.split("T")[0],
          user_id: entry.user_id,
        });
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Erro ao carregar dados do lançamento");
      } finally {
        setLoadingCategories(false);
        setLoadingEntry(false);
      }
    };

    fetchData();
  }, [id]);

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

      await api.patch(
        process.env.REACT_APP_API_URL + `/financial-entries/${id}`,
        dataToSend
      );

      navigate("/dashboard");
    } catch (err) {
      console.error("Erro ao atualizar lançamento:", err);
      setError(
        err.response?.data?.message || "Erro ao atualizar lançamento financeiro"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingEntry) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingMessage}> Carregando lançamento... </div>{" "}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2> Editar Lançamento Financeiro </h2>{" "}
        {error && <div className={styles.errorMessage}> {error} </div>}{" "}
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
            />{" "}
          </div>{" "}
          <div className={styles.formGroup}>
            <label htmlFor="description"> Descrição </label>{" "}
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
            />{" "}
          </div>{" "}
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
          </div>{" "}
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
          </div>{" "}
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
          </div>{" "}
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
                {" "}
                Carregando categorias...{" "}
              </span>
            )}{" "}
          </div>{" "}
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

export default EditFinancialEntry;
