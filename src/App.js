import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import Login from "./modules/auth/Login";
import Dashbord from "./modules/dashboard/dashboard";
import NewFinancialEntry from "./modules/financial-entries/NewFinancialEntry";
import EditFinancialEntry from "./modules/financial-entries/EditFinancialEntry";
import FinancialCategories from "./modules/financial-categories/FinancialCategories";
import NewFinancialCategory from "./modules/financial-categories/NewFinancialCategory";
import EditFinancialCategory from "./modules/financial-categories/EditFinancialCategory";
import { PublicRoute } from "./routes/PublicRoute";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import FinancialSummary from "./modules/financial-summary/FinancialSummary";
import Register from "./modules/auth/Register";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashbord />
              </ProtectedRoute>
            }
          />
          <Route
            path="/financial-entries/new"
            element={
              <ProtectedRoute>
                <NewFinancialEntry />
              </ProtectedRoute>
            }
          />
          <Route
            path="/financial-entries/:id/edit"
            element={
              <ProtectedRoute>
                <EditFinancialEntry />
              </ProtectedRoute>
            }
          />
          <Route
            path="/financial-categories"
            element={
              <ProtectedRoute>
                <FinancialCategories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/financial-categories/new"
            element={
              <ProtectedRoute>
                <NewFinancialCategory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/financial-categories/:id/edit"
            element={
              <ProtectedRoute>
                <EditFinancialCategory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/financial-summary"
            element={
              <ProtectedRoute>
                <FinancialSummary />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
