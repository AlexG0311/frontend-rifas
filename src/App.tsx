import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Rifas from "./pages/Rifas";
import RifaPage from "./pages/RifaPage";
import AdminRoutes from "./pages/admin/AdminRoutes";
import PagoResultado from "./pages/PagoResultado";

function PublicLayout() {
  return (
    <div className="public-theme min-h-screen bg-[#0F071A] text-[#F5F3FF] antialiased selection:bg-[#8B5CF6] selection:text-white">
      <Outlet />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route element={<PublicLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/rifas" element={<Rifas />} />
        <Route path="/rifa/:uuid" element={<RifaPage />} />
        <Route path="/pago/resultado" element={<PagoResultado />} />
      </Route>
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}