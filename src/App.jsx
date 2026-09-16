import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductSelect from "./pages/ProductSelect";
import LineOverview from "./pages/LineOverview";
import MachineParams from "./pages/MachineParams";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<ProductSelect />} />
          <Route path="/produto/:productKey" element={<LineOverview />} />
          <Route path="/produto/:productKey/:sectionId/:machineId" element={<MachineParams />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/painel" element={<AdminPanel />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
