import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import styles from "./Register.module.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    // Validação básica
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post(
        process.env.REACT_APP_API_URL + "/users",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      // Se o registro for bem-sucedido, redireciona para o login
      navigate("/login", {
        state: {
          message: "Cadastro realizado com sucesso! Faça login para continuar.",
        },
      });
    } catch (err) {
      console.error("Erro ao registrar:", err);
      setError(
        err.response?.data?.message ||
          "Erro ao realizar cadastro. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2> Cadastro </h2>{" "}
        {error && <div className={styles.errorMessage}> {error} </div>}{" "}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name"> Nome </label>{" "}
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="Digite seu nome completo"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email"> E-mail </label>{" "}
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="Digite seu e-mail"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password"> Senha </label>{" "}
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="Digite sua senha"
              minLength="6"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword"> Confirmar Senha </label>{" "}
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="Confirme sua senha"
              minLength="6"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {" "}
            {loading ? "Cadastrando..." : "Cadastrar"}{" "}
          </button>
          <div className={styles.registerLink}>
            Já tem uma conta?
            <button
              type="button"
              onClick={() => navigate("/login")}
              className={styles.linkButton}
            >
              Faça login{" "}
            </button>{" "}
          </div>{" "}
        </form>{" "}
      </div>{" "}
    </div>
  );
};

export default Register;
