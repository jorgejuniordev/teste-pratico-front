import React, { useState } from "react";
import { AuthProvider, useAuth } from "../../contexts/AuthContext";
import styles from "./Login.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Pega a mensagem do estado da navegação (vindo do registro ou logout)
  const stateMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validação simples
    if (!email || !password) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    try {
      const result = await login(email, password);

      // se o login foi realizado com sucesso, redireciona para a página de dashboard
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.message || "Credenciais inválidas");
      }
    } catch (error) {
      setError(
        "Ocorreu uma falha ao tentar realizar o login. Tente novamente mais tarde."
      );
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.loginHeader}>
          <h1> Bem-vindo </h1>{" "}
        </div>
        {/* Mostra mensagem de sucesso se existir */}{" "}
        {stateMessage && (
          <div className={styles.successMessage}> {stateMessage} </div>
        )}
        {/* Mostra mensagem de erro se existir */}{" "}
        {error && <div className={styles.errorMessage}> {error} </div>}
        <form
          className={styles.loginForm}
          onSubmit={(e) => {
            handleSubmit(e);
            return false;
          }}
        >
          <div className={styles.formGroup}>
            <label htmlFor="email"> E-mail </label>{" "}
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              className={styles.inputField}
            />{" "}
          </div>{" "}
          <div className={styles.formGroup}>
            <label htmlFor="password"> Senha </label>{" "}
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              className={styles.inputField}
              required
            />
          </div>{" "}
          <button type="submit" className={styles.loginButton}>
            Entrar{" "}
          </button>{" "}
          <p>
            Não tem uma conta? <Link to="/register"> Cadastre-se </Link>{" "}
          </p>{" "}
        </form>{" "}
      </div>{" "}
    </div>
  );
};

export default Login;
