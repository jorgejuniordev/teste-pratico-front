import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Rota pública - para acessar a rota, o usuário não precisa estar autenticado (se estiver autenticado, será redirecionado para a rota /dashboard)
export function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return !user ? children : <Navigate to="/dashboard" replace />;
}
