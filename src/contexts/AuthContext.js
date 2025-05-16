import { createContext, use, useContext, useEffect, useState } from "react";
import api from "../services/api";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // função para carregar o usuário conectado
    async function loadUser() {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(JSON.parse(user));
      }

      setLoading(false);
    }

    loadUser();
  }, []);

  // função para fazer login
  async function login(email, password) {
    try {
      const response = await api.post(
        process.env.REACT_APP_API_URL + "/auth/login",
        { email, password }
      );

      console.log("falha");
      console.log(response.data);

      const { access_token, user } = response.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

      setUser(user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Falha no login",
      };
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {" "}
      {children}{" "}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
