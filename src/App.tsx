import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import RifaPage from "./pages/RifaPage";
import AdminDashboard from "./pages/admin/Dashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/rifa/:uuid" element={<RifaPage />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}