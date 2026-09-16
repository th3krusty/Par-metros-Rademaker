import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SECTIONS, MACHINES, getAllProductVariants } from "../data/schema";
import { fetchAllMachineIcons } from "../lib/machineIcons";
import MachineIcon from "../components/MachineIcon";

export default function LineOverview() {
  const { productKey } = useParams();
  const [sectionId, setSectionId] = useState(SECTIONS[0].id);
  const [icons, setIcons] = useState({});
  const navigate = useNavigate();

  const product = getAllProductVariants().find((p) => p.productKey === productKey);
  const machines = MACHINES[sectionId] ?? [];

  useEffect(() => {
    fetchAllMachineIcons().then(setIcons);
  }, []);

  return (
    <div className="overview-screen">
      <header className="overview-header">
        <button className="back-link" onClick={() => navigate("/")}>
          ← Trocar produto
        </button>
        <h1 className="overview-title">{product?.label ?? productKey}</h1>
      </header>

      <nav className="section-tabs">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            className={`section-tab ${s.id === sectionId ? "active" : ""}`}
            onClick={() => setSectionId(s.id)}
          >
            {s.label}
          </button>
        ))}
      </nav>

      <div className="line-diagram">
        {machines.map((machine, i) => (
          <div className="line-diagram-item" key={machine.id}>
            <button
              className="machine-node"
              onClick={() => navigate(`/produto/${productKey}/${sectionId}/${machine.id}`)}
              title={machine.label}
            >
              <MachineIcon imageSrc={icons[machine.id]} />
            </button>
            <span className="machine-node-label">{machine.label}</span>
            {i < machines.length - 1 && <div className="line-connector" />}
          </div>
        ))}
      </div>
    </div>
  );
}
