import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import api from "../../services/api";
import Header from "../../components/Header/Header";
import { formatCurrency } from "../../utils/formatters";

const Dashboard = () => {
  const navigate = useNavigate();
  const [financialEntries, setFinancialEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const fetchFinancialEntries = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token de autenticação inválido.");
      }

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await api.get(
        process.env.REACT_APP_API_URL + "/financial-entries"
      );

      setFinancialEntries(response.data);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar lançamentos:", err);
      setError("Erro ao carregar lançamentos financeiros");
      setFinancialEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialEntries();
  }, []);

  const handleAddEntry = () => {
    navigate("/financial-entries/new");
  };

  const handleEditEntry = (id) => {
    navigate(`/financial-entries/${id}/edit`);
  };

  const handleDeleteEntry = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este lançamento?")) {
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
        process.env.REACT_APP_API_URL + `/financial-entries/${id}`
      );

      await fetchFinancialEntries();
    } catch (err) {
      console.error("Erro ao excluir lançamento:", err);
      setError("Erro ao excluir lançamento financeiro");
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <div className={styles.tableHeader}>
          <h1> Lançamentos Financeiros </h1>{" "}
          <button className={styles.addButton} onClick={handleAddEntry}>
            Adicionar{" "}
          </button>{" "}
        </div>{" "}
        {error && <div className={styles.errorMessage}> {error} </div>}{" "}
        {loading ? (
          <div className={styles.loadingMessage}>
            {" "}
            Carregando lançamentos...{" "}
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th> Data </th> <th> Título </th> <th> Descrição </th>{" "}
                  <th> Valor </th> <th> Tipo </th> <th> Categoria </th>{" "}
                  <th> Ações </th>{" "}
                </tr>{" "}
              </thead>{" "}
              <tbody>
                {" "}
                {financialEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td>
                      {" "}
                      {new Date(entry.date_entry).toLocaleDateString(
                        "pt-BR"
                      )}{" "}
                    </td>{" "}
                    <td> {entry.title} </td> <td> {entry.description} </td>{" "}
                    <td> {formatCurrency(entry.value)} </td>{" "}
                    <td> {entry.type === "income" ? "Receita" : "Despesa"} </td>{" "}
                    <td>
                      {" "}
                      {entry.category
                        ? entry.category.name
                        : "Sem categoria"}{" "}
                    </td>{" "}
                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          className={styles.editButton}
                          onClick={() => handleEditEntry(entry.id)}
                        >
                          Editar{" "}
                        </button>{" "}
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDeleteEntry(entry.id)}
                          disabled={deleteLoading === entry.id}
                        >
                          {deleteLoading === entry.id
                            ? "Excluindo..."
                            : "Excluir"}{" "}
                        </button>{" "}
                      </div>{" "}
                    </td>{" "}
                  </tr>
                ))}{" "}
              </tbody>{" "}
            </table>{" "}
          </div>
        )}{" "}
      </div>{" "}
    </div>
  );
};

export default Dashboard;
