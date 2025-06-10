// configuracion de react router
// definir rutas para luego ser importado a app
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import MainPanel from "../pages/MainPanel";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/main-panel" element={<MainPanel />} />
    </Routes>
  );
}

export default AppRoutes;
