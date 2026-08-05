import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Rifas from "./pages/Rifas";
import RifaPage from "./pages/RifaPage";
import AdminRoutes from "./pages/admin/AdminRoutes";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/rifas" element={<Rifas />} />
      <Route path="/rifa/:uuid" element={<RifaPage />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}