import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { formatCurrency } from "../../utils/formatters";
import styles from "./FinancialSummary.module.css";
import Header from "../../components/Header/Header";

const FinancialSummary = () => {
  // state para armazenar o resumo financeiro
  const [summary, setSummary] = useState({
    total_income: 0,
    total_expense: 0,
    balance: 0,
  });

  // state para armazenar o loading
  const [loading, setLoading] = useState(true);

  // state para armazenar o erro
  const [error, setError] = useState("");

  // state para armazenar o range de datas
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      .toISOString()
      .split("T")[0],
  });

  // função para buscar o resumo financeiro
  const fetchSummary = async () => {
    try {
      setLoading(true);

      // pega o token do localStorage
      const token = localStorage.getItem("token");

      // se não houver token, lança um erro
      if (!token) {
        throw new Error("Token de autenticação inválido.");
      }

      // adiciona o token no header da requisição
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // faz a requisição para o endpoint de resumo financeiro
      const response = await api.get(
        `${process.env.REACT_APP_API_URL}/financial-entries/resume/${dateRange.startDate}/${dateRange.endDate}`
      );

      // seta o resumo financeiro
      setSummary(response.data);

      // reseta o erro
      setError("");
    } catch (err) {
      console.error("Erro ao buscar resumo:", err);
      setError("Erro ao carregar resumo financeiro");
    } finally {
      setLoading(false);
    }
  };

  // busca o resumo financeiro quando o range de datas mudar
  useEffect(() => {
    fetchSummary();
  }, [dateRange]);

  // função para lidar com o evento de mudança do range de datas
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.summaryContainer}>
        <h2>Resumo Financeiro</h2>

        <div className={styles.dateRangeContainer}>
          <div className={styles.dateInput}>
            <label htmlFor="startDate">Data Inicial</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
              className={styles.input}
            />
          </div>
          <div className={styles.dateInput}>
            <label htmlFor="endDate">Data Final</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
              className={styles.input}
            />
          </div>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        {loading ? (
          <div className={styles.loadingMessage}>Carregando resumo...</div>
        ) : (
          <div className={styles.summaryContent}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Total de Receitas:</span>
              <span className={`${styles.value} ${styles.income}`}>
                {formatCurrency(summary.total_income)}
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Total de Despesas:</span>
              <span className={`${styles.value} ${styles.expense}`}>
                {formatCurrency(summary.total_expense)}
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Saldo:</span>
              <span
                className={`${styles.value} ${
                  summary.balance >= 0 ? styles.positive : styles.negative
                }`}
              >
                {formatCurrency(summary.balance)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialSummary;
