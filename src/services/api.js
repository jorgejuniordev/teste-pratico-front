import axios from "axios";

// endpoint de login
const api = axios.create({
  baseUrl: process.env.REACT_APP_API_URL + "/auth/login",
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpa os dados de autenticação
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redireciona para o login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
