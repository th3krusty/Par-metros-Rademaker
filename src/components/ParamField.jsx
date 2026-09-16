import { useState } from "react";
import { FIELD_TYPES } from "../data/schema";
import ManipuloDial from "./ManipuloDial";

function InfoIcon({ text }) {
  const [open, setOpen] = useState(false);
  if (!text) return null;
  return (
    <span className="info-wrap">
      <button
        type="button"
        className="info-icon"
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setOpen(false)}
        aria-label="Explicação do parâmetro"
      >
        i
      </button>
      {open && <div className="info-tooltip">{text}</div>}
    </span>
  );
}

// Exibição somente-leitura de um campo de parâmetro (tela pública).
export default function ParamField({ field, value }) {
  return (
    <div className="param-field">
      <div className="param-field-label">
        {field.label}
        <InfoIcon text={field.description} />
      </div>

      {field.type === FIELD_TYPES.MANIPULO ? (
        <div className="manipulos-grid">
          {Array.from({ length: field.count ?? 1 }).map((_, i) => (
            <ManipuloDial
              key={i}
              value={Array.isArray(value) ? value[i] : field.count > 1 ? undefined : value}
              label={field.count > 1 ? `${i + 1}` : null}
            />
          ))}
        </div>
      ) : field.type === FIELD_TYPES.LEVER_GROUP ? (
        <div className="lever-values">
          {Array.from({ length: field.count }).map((_, i) => (
            <div className="lever-value" key={i}>
              <span className="lever-index">{i + 1}</span>
              <span className="lever-number">{(value?.[i] ?? "—") || "—"}</span>
            </div>
          ))}
        </div>
      ) : field.type === FIELD_TYPES.TOGGLE ? (
        <div className="param-value param-value--tag">{value || field.options[0]}</div>
      ) : (
        <div className="param-value">
          {value === "" || value === undefined ? "—" : value}
          {field.unit ? <span className="param-unit">{field.unit}</span> : null}
        </div>
      )}
    </div>
  );
}
