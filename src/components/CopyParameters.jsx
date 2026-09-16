import { useState } from "react";
import { copyParameters } from "../lib/parameters";

// Permite replicar os parâmetros já preenchidos de um produto para
// outro, pra não precisar digitar tudo de novo quando a maior parte
// dos equipamentos usa os mesmos valores.
export default function CopyParameters({ products, currentProductKey, onCopied }) {
  const [open, setOpen] = useState(false);
  const [fromKey, setFromKey] = useState("");
  const [targetKeys, setTargetKeys] = useState([]);
  const [overwrite, setOverwrite] = useState(false);
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  const origem = products.find((p) => p.productKey === fromKey);

  function toggleTarget(key) {
    setTargetKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  async function handleCopy() {
    if (!fromKey || targetKeys.length === 0) {
      setStatus({ type: "erro", msg: "Escolha o produto de origem e pelo menos um destino." });
      return;
    }

    const nomesDestino = targetKeys
      .map((k) => products.find((p) => p.productKey === k)?.label)
      .join(", ");

    const aviso = overwrite
      ? `Isso vai SOBRESCREVER todos os parâmetros de: ${nomesDestino}, com os valores de ${origem.label}. Continuar?`
      : `Copiar os parâmetros de ${origem.label} para: ${nomesDestino}? (valores já preenchidos no destino serão mantidos)`;

    if (!confirm(aviso)) return;

    setBusy(true);
    setStatus(null);
    try {
      let total = 0;
      for (const destino of targetKeys) {
        total += await copyParameters(fromKey, destino, { overwrite });
      }
      setStatus({
        type: "ok",
        msg:
          total === 0
            ? "Nada foi copiado — os destinos já tinham todos esses valores preenchidos."
            : `${total} valor(es) copiado(s) com sucesso.`,
      });
      setTargetKeys([]);
      onCopied();
    } catch {
      setStatus({ type: "erro", msg: "Erro ao copiar. Tente novamente." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="copy-params">
      <button className="copy-params-toggle" onClick={() => setOpen((o) => !o)}>
        {open ? "Fechar cópia de parâmetros" : "Copiar parâmetros entre produtos"}
      </button>

      {open && (
        <div className="copy-params-body">
          <label className="copy-params-field">
            Copiar DE (produto já preenchido)
            <select value={fromKey} onChange={(e) => setFromKey(e.target.value)}>
              <option value="">Selecione…</option>
              {products.map((p) => (
                <option key={p.productKey} value={p.productKey}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>

          <div className="copy-params-field">
            <span>Copiar PARA</span>
            <div className="copy-params-targets">
              {products
                .filter((p) => p.productKey !== fromKey)
                .map((p) => (
                  <label key={p.productKey} className="copy-params-check">
                    <input
                      type="checkbox"
                      checked={targetKeys.includes(p.productKey)}
                      onChange={() => toggleTarget(p.productKey)}
                    />
                    {p.label}
                  </label>
                ))}
            </div>
          </div>

          <label className="copy-params-check copy-params-overwrite">
            <input type="checkbox" checked={overwrite} onChange={(e) => setOverwrite(e.target.checked)} />
            Sobrescrever valores que já existem no destino
          </label>
          <p className="copy-params-hint">
            {overwrite
              ? "Atenção: qualquer ajuste específico já feito nos produtos de destino será perdido."
              : "Modo seguro: só preenche o que ainda está vazio no destino."}
          </p>

          {status && (
            <p className={status.type === "ok" ? "copy-params-ok" : "copy-params-error"}>{status.msg}</p>
          )}

          <button className="copy-params-run" onClick={handleCopy} disabled={busy}>
            {busy ? "Copiando…" : "Copiar parâmetros"}
          </button>
        </div>
      )}
    </div>
  );
}
