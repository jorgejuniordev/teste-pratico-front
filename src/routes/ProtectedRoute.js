import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Rota protegida - para acessar a rota, o usuário deve estar autenticado
export function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return user
    ? children
    : navigate("/login", {
        state: {
          message: "Logout realizado com sucesso!",
        },
      });
}
