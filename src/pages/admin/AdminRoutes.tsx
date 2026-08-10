import "./index.css";
import { Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import AddProducts from "./pages/Productos/Productos";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Ganadores/BasicTables";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import RifasPage from "./pages/Rifas/RifasPage";
import RifaFormPage from "./pages/Rifas/RifaFormPage";
import Home from "./pages/Dashboard/Home";
import ResultadosLoteria from "./pages/Resultados/ResultadosLoteria";
import ResultadosRifas from "./pages/Resultados/ResultadosRifas";
import CombosPage from "./pages/Combos/CombosPage";
import { ProtectedRoute } from './routes/ProtectedRoute';

export default function AdminRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={
            <ProtectedRoute><Home /></ProtectedRoute>
          } />
          <Route path="add-products" element={
            <ProtectedRoute><AddProducts /></ProtectedRoute>
          } />
          <Route path="Rifas" element={
            <ProtectedRoute><RifasPage /></ProtectedRoute>
          } />
          <Route path="Rifas/crear" element={
            <ProtectedRoute><RifaFormPage /></ProtectedRoute>
          } />
          <Route path="Rifas/editar/:uuidPublico" element={
            <ProtectedRoute><RifaFormPage /></ProtectedRoute>
          } />
          <Route path="combos" element={
            <ProtectedRoute><CombosPage /></ProtectedRoute>
          } />
          <Route path="resultados/loteria" element={
            <ProtectedRoute><ResultadosLoteria /></ProtectedRoute>
          } />
          <Route path="resultados/rifas" element={
            <ProtectedRoute><ResultadosRifas /></ProtectedRoute>
          } />
          <Route path="calendar" element={
            <ProtectedRoute><Calendar /></ProtectedRoute>
          } />
          <Route path="blank" element={
            <ProtectedRoute><Blank /></ProtectedRoute>
          } />
          <Route path="Ganadores" element={
            <ProtectedRoute><BasicTables /></ProtectedRoute>
          } />
        </Route>

        <Route path="signin" element={<SignIn />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}