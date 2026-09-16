import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MACHINES, getAllProductVariants } from "../data/schema";
import { fetchParameters } from "../lib/parameters";
import { fetchMachineFields } from "../lib/machineFields";
import ParamField from "../components/ParamField";

export default function MachineParams() {
  const { productKey, sectionId, machineId } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState({});
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  const product = getAllProductVariants().find((p) => p.productKey === productKey);
  const machine = (MACHINES[sectionId] ?? []).find((m) => m.id === machineId);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([fetchParameters(productKey), fetchMachineFields(machineId)]).then(
      ([v, f]) => {
        if (active) {
          setValues(v);
          setFields(f);
          setLoading(false);
        }
      }
    );
    return () => {
      active = false;
    };
  }, [productKey, machineId]);

  if (!machine) {
    return <p className="empty-state">Máquina não encontrada.</p>;
  }

  return (
    <div className="machine-screen">
      <button className="back-link" onClick={() => navigate(`/produto/${productKey}`)}>
        ← Voltar ao diagrama
      </button>

      <h1 className="machine-title">{machine.label}</h1>
      <p className="machine-subtitle">
        {product?.label} · {sectionId === "linha1" ? "Linha 1" : sectionId === "linha2" ? "Linha 2" : "Linha 3"}
      </p>

      {machine.description && <p className="machine-description">{machine.description}</p>}
      {machine.manualRef && <p className="machine-manual-ref">{machine.manualRef}</p>}

      {loading ? (
        <p className="empty-state">Carregando parâmetros…</p>
      ) : fields.length === 0 ? (
        <p className="empty-state">
          Nenhum campo cadastrado ainda para essa máquina. Adicione pela área de administrador.
        </p>
      ) : (
        <div className="param-grid">
          {fields.map((field) => (
            <ParamField key={field.key} field={field} value={values[`${machine.id}.${field.key}`]} />
          ))}
        </div>
      )}
    </div>
  );
}
