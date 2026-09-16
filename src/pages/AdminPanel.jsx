import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SECTIONS, MACHINES, getAllProductVariants } from "../data/schema";
import { fetchParameters, saveParameter } from "../lib/parameters";
import { fetchMachineFields } from "../lib/machineFields";
import { fetchMachineIcon } from "../lib/machineIcons";
import { isAdminLoggedIn, logoutAdmin } from "../lib/auth";
import EditableParamField from "../components/EditableParamField";
import FieldManager from "../components/FieldManager";
import IconUploader from "../components/IconUploader";

const PRODUCT_VARIANTS = getAllProductVariants();

export default function AdminPanel() {
  const navigate = useNavigate();
  const [productKey, setProductKey] = useState(PRODUCT_VARIANTS[0].productKey);
  const [sectionId, setSectionId] = useState(SECTIONS[0].id);
  const [machineId, setMachineId] = useState(MACHINES[SECTIONS[0].id][0].id);
  const [values, setValues] = useState({});
  const [fields, setFields] = useState([]);
  const [icon, setIcon] = useState(null);
  const [savingKey, setSavingKey] = useState(null);
  const [reloadTick, setReloadTick] = useState(0);

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate("/admin");
    }
  }, [navigate]);

  function handleSectionChange(newSectionId) {
    setSectionId(newSectionId);
    setMachineId(MACHINES[newSectionId][0].id);
  }

  useEffect(() => {
    fetchParameters(productKey).then(setValues);
  }, [productKey, reloadTick]);

  useEffect(() => {
    fetchMachineFields(machineId).then(setFields);
    fetchMachineIcon(machineId).then(setIcon);
  }, [machineId, reloadTick]);

  function refresh() {
    setReloadTick((t) => t + 1);
  }

  function handleFieldChange(field, newValue) {
    const key = `${machine.id}.${field.key}`;
    setValues((v) => ({ ...v, [key]: newValue }));
  }

  async function persistField(field, valueToSave) {
    const key = `${machine.id}.${field.key}`;
    setSavingKey(key);
    try {
      await saveParameter(productKey, machine.id, field.key, valueToSave);
    } finally {
      setSavingKey(null);
    }
  }

  // `explicitValue` é usado por selects (toggle/radio), que já sabem o
  // valor novo no momento da troca — evita depender do timing do setState.
  function handleFieldBlur(field, explicitValue) {
    const key = `${machine.id}.${field.key}`;
    persistField(field, explicitValue !== undefined ? explicitValue : values[key]);
  }

  function handleLogout() {
    logoutAdmin();
    navigate("/");
  }

  const machine = MACHINES[sectionId].find((m) => m.id === machineId);

  if (!machine) {
    // Estado transitório (trocando de seção) — evita quebrar a tela.
    return null;
  }

  return (
    <div className="admin-screen">
      <header className="admin-header">
        <h1 className="admin-title">Administração de parâmetros</h1>
        <button className="logout-button" onClick={handleLogout}>
          Sair
        </button>
      </header>

      <div className="admin-selectors">
        <label className="admin-selector">
          Produto
          <select value={productKey} onChange={(e) => setProductKey(e.target.value)}>
            {PRODUCT_VARIANTS.map((p) => (
              <option key={p.productKey} value={p.productKey}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        <label className="admin-selector">
          Seção
          <select value={sectionId} onChange={(e) => handleSectionChange(e.target.value)}>
            {SECTIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <label className="admin-selector">
          Máquina
          <select value={machineId} onChange={(e) => setMachineId(e.target.value)}>
            {MACHINES[sectionId].map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {machine.description && <p className="machine-description">{machine.description}</p>}

      <IconUploader machineId={machine.id} currentIcon={icon} onChanged={refresh} />

      {fields.length === 0 ? (
        <p className="empty-state">Nenhum campo ainda nessa máquina. Adicione um abaixo.</p>
      ) : (
        <div className="param-grid">
          {fields.map((field) => (
            <EditableParamField
              key={field.key}
              field={field}
              value={values[`${machine.id}.${field.key}`]}
              saving={savingKey === `${machine.id}.${field.key}`}
              onChange={(v) => handleFieldChange(field, v)}
              onBlur={(explicitValue) => handleFieldBlur(field, explicitValue)}
            />
          ))}
        </div>
      )}

      <FieldManager machineId={machine.id} fields={fields} onChanged={refresh} />

      <p className="admin-save-note">
        Os campos de valor são salvos automaticamente ao sair de cada campo. Adicionar/excluir campos e
        trocar a foto tem efeito imediato.
      </p>
    </div>
  );
}
