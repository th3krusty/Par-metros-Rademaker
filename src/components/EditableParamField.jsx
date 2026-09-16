import { FIELD_TYPES } from "../data/schema";

// Campo de parâmetro editável (tela de admin). Chama onChange(newValue)
// a cada edição; quem chama decide quando persistir (ao sair do campo).
export default function EditableParamField({ field, value, onChange, onBlur, saving }) {
  return (
    <div className="param-field param-field--editable">
      <div className="param-field-label">
        {field.label}
        {field.description && <span className="admin-hint" title={field.description}>ⓘ</span>}
      </div>

      {field.type === FIELD_TYPES.LEVER_GROUP ? (
        <div className="lever-values lever-values--editable">
          {Array.from({ length: field.count }).map((_, i) => (
            <div className="lever-value" key={i}>
              <span className="lever-index">{i + 1}</span>
              <input
                type="number"
                className="param-input param-input--small"
                value={value?.[i] ?? ""}
                onChange={(e) => {
                  const next = [...(value ?? Array(field.count).fill(""))];
                  next[i] = e.target.value;
                  onChange(next);
                }}
                onBlur={() => onBlur?.()}
              />
            </div>
          ))}
        </div>
      ) : field.type === FIELD_TYPES.TOGGLE ? (
        <select
          className="param-input"
          value={value || field.options[0]}
          onChange={(e) => {
            onChange(e.target.value);
            onBlur?.(e.target.value);
          }}
        >
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : field.type === FIELD_TYPES.RADIO ? (
        <select
          className="param-input"
          value={value ?? ""}
          onChange={(e) => {
            onChange(e.target.value);
            onBlur?.(e.target.value);
          }}
        >
          <option value="" disabled>
            Selecione
          </option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <div className="param-input-wrap">
          <input
            type="number"
            step="any"
            className="param-input"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => onBlur?.()}
          />
          {field.unit ? <span className="param-unit">{field.unit}</span> : null}
        </div>
      )}
      {saving && <span className="saving-indicator">salvando…</span>}
    </div>
  );
}
