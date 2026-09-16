// Manípulo Rademaker — reproduz visualmente o volante de ajuste manual
// da máquina (corpo azul escuro com lóbulos, aro metálico com parafusos,
// mostrador branco com o valor no centro).
export default function ManipuloDial({ value, label, size = 104, editable = false, onChange, onBlur }) {
  const display = value === "" || value === undefined || value === null ? "—" : String(value);

  return (
    <div className="manipulo-wrap">
      <div className="manipulo" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="manipulo-svg">
          <defs>
            <radialGradient id="mCorpo" cx="38%" cy="28%" r="80%">
              <stop offset="0%" stopColor="#4e5885" />
              <stop offset="55%" stopColor="#343e6b" />
              <stop offset="100%" stopColor="#212949" />
            </radialGradient>
            <linearGradient id="mAro" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d8d8d4" />
              <stop offset="50%" stopColor="#a8a8a2" />
              <stop offset="100%" stopColor="#cfcfc9" />
            </linearGradient>
          </defs>

          {/* Corpo externo azul com lóbulos arredondados */}
          <path
            fill="url(#mCorpo)"
            d="M50 2
               a12 12 0 0 1 10.4 6
               a12 12 0 0 0 10.4 6
               a12 12 0 0 1 10.4 6
               a12 12 0 0 1 0 12
               a12 12 0 0 0 0 12
               a12 12 0 0 1 0 12
               a12 12 0 0 1-10.4 6
               a12 12 0 0 0-10.4 6
               a12 12 0 0 1-10.4 6
               a12 12 0 0 1-10.4-6
               a12 12 0 0 0-10.4-6
               a12 12 0 0 1-10.4-6
               a12 12 0 0 1 0-12
               a12 12 0 0 0 0-12
               a12 12 0 0 1 0-12
               a12 12 0 0 1 10.4-6
               a12 12 0 0 0 10.4-6
               a12 12 0 0 1 10.4-6 z"
          />
          {/* fallback circular por baixo, garante o corpo cheio */}
          <circle cx="50" cy="50" r="48" fill="url(#mCorpo)" />

          {/* Aro metálico */}
          <circle cx="50" cy="50" r="36" fill="url(#mAro)" />
          {/* Mostrador branco */}
          <circle cx="50" cy="50" r="30" fill="#f4f3ef" />

          {/* Parafusos do aro */}
          {[
            [50, 17.5],
            [73, 38],
            [64, 68],
            [36, 68],
            [27, 38],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="2.2" fill="#8e8e88" stroke="#6b6b66" strokeWidth="0.5" />
          ))}

          {/* Eixo central */}
          <circle cx="50" cy="62" r="2.6" fill="#5a5a55" />
        </svg>

        {/* Valor no centro do mostrador */}
        {editable ? (
          <input
            className="manipulo-input"
            type="number"
            step="any"
            value={value ?? ""}
            onChange={(e) => onChange?.(e.target.value)}
            onBlur={() => onBlur?.()}
          />
        ) : (
          <span className="manipulo-value">{display}</span>
        )}

        <span className="manipulo-brand">Rademaker</span>
      </div>
      {label && <span className="manipulo-label">{label}</span>}
    </div>
  );
}
