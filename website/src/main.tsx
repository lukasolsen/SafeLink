import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layout/index.tsx";
import Register from "./pages/Register.tsx";
import Login from "./pages/Login.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ProtectedRoute } from "./layout/ProtectedRoute.tsx";
import NotFound from "./pages/404.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Clients from "./pages/Clients.tsx";
import DashboardLayout from "./layout/Dashboard.tsx";
import Client from "./pages/Client/index.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<App />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route element={<DashboardLayout />}>
            <Route
              path="/dashboard"
              element={<ProtectedRoute element={<Dashboard />} />}
            />
            <Route
              path="/dashboard/clients"
              element={<ProtectedRoute element={<Clients />} />}
            />
            <Route
              path="/dashboard/client/:id"
              element={<ProtectedRoute element={<Client />} />}
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);
