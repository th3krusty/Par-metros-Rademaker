import { useState } from "react";
import { addMachineField, deleteMachineField } from "../lib/machineFields";

const TYPE_LABELS = {
  number: "Número",
  toggle: "Duas opções (toggle)",
  radio: "Várias opções (lista)",
  lever_group: "Grupo de alavancas",
};

export default function FieldManager({ machineId, fields, onChanged }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ key: "", label: "", type: "number", unit: "", optionsText: "", count: 5, description: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function resetForm() {
    setForm({ key: "", label: "", type: "number", unit: "", optionsText: "", count: 5, description: "" });
  }

  async function handleAdd(e) {
    e.preventDefault();
    setError("");
    if (!form.label.trim()) {
      setError("Dê um nome pro campo.");
      return;
    }
    const key = form.key.trim() || slugify(form.label);
    if (fields.some((f) => f.key === key)) {
      setError("Já existe um campo com essa chave nessa máquina.");
      return;
    }
    setSaving(true);
    try {
      await addMachineField(machineId, { ...form, key });
      resetForm();
      onChanged();
    } catch {
      setError("Erro ao salvar o campo. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(fieldKey) {
    if (!confirm("Excluir esse campo? Os valores já salvos dele deixam de aparecer.")) return;
    await deleteMachineField(machineId, fieldKey);
    onChanged();
  }

  return (
    <div className="field-manager">
      <button className="field-manager-toggle" onClick={() => setOpen((o) => !o)}>
        {open ? "Fechar gerenciamento de campos" : "Gerenciar campos desta máquina"}
      </button>

      {open && (
        <div className="field-manager-body">
          <ul className="field-manager-list">
            {fields.map((f) => (
              <li key={f.key} className="field-manager-item">
                <span>
                  <strong>{f.label}</strong>{" "}
                  <span className="field-manager-meta">
                    ({TYPE_LABELS[f.type] ?? f.type}
                    {f.unit ? `, ${f.unit}` : ""})
                  </span>
                </span>
                <button className="field-manager-delete" onClick={() => handleDelete(f.key)}>
                  Excluir
                </button>
              </li>
            ))}
            {fields.length === 0 && <li className="field-manager-empty">Nenhum campo ainda.</li>}
          </ul>

          <form className="field-manager-form" onSubmit={handleAdd}>
            <h3>Adicionar campo</h3>
            <label>
              Nome do campo
              <input
                type="text"
                value={form.label}
                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                placeholder="Ex: Temperatura do forno"
              />
            </label>

            <label>
              Tipo
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
                <option value="number">Número</option>
                <option value="toggle">Duas opções (toggle)</option>
                <option value="radio">Várias opções (lista)</option>
                <option value="lever_group">Grupo de alavancas</option>
              </select>
            </label>

            {form.type === "number" && (
              <label>
                Unidade (opcional)
                <input
                  type="text"
                  value={form.unit}
                  onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                  placeholder="Ex: mm, %, m/min, s"
                />
              </label>
            )}

            {(form.type === "toggle" || form.type === "radio") && (
              <label>
                Opções (separadas por vírgula)
                <input
                  type="text"
                  value={form.optionsText}
                  onChange={(e) => setForm((f) => ({ ...f, optionsText: e.target.value }))}
                  placeholder="Ex: Sólido, Líquido"
                />
              </label>
            )}

            {form.type === "lever_group" && (
              <label>
                Quantidade de alavancas
                <input
                  type="number"
                  min="1"
                  value={form.count}
                  onChange={(e) => setForm((f) => ({ ...f, count: e.target.value }))}
                />
              </label>
            )}

            <label>
              Explicação (opcional, aparece no ícone ⓘ)
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
              />
            </label>

            {error && <p className="field-manager-error">{error}</p>}

            <button type="submit" className="field-manager-add" disabled={saving}>
              {saving ? "Salvando…" : "Adicionar campo"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}
