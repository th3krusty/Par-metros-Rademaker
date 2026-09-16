import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PRODUCTS } from "../data/schema";

export default function ProductSelect() {
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();

  function handleSelect(product) {
    if (product.variants) {
      setExpanded(product);
    } else {
      navigate(`/produto/${product.id}`);
    }
  }

  if (expanded) {
    return (
      <div className="select-screen">
        <button className="back-link" onClick={() => setExpanded(null)}>
          ← Voltar
        </button>
        <h1 className="select-title">{expanded.label}</h1>
        <p className="select-subtitle">Escolha a variante</p>
        <div className="product-grid">
          {expanded.variants.map((v) => (
            <button
              key={v.id}
              className="product-button"
              onClick={() => navigate(`/produto/${v.id}`)}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="select-screen">
      <h1 className="select-title">Painel de Parâmetros RADEMAKER</h1>
      <p className="select-subtitle">Selecione o produto</p>
      <div className="product-grid">
        {PRODUCTS.map((p) => (
          <button key={p.id} className="product-button" onClick={() => handleSelect(p)}>
            {p.label}
          </button>
        ))}
        <div className="creditos">
          <a href="/admin" className="creditos-link">
            <h9>Administrado por:</h9>
          </a>
          <p>Diego S. Batista</p>
        </div>
      </div>
    </div>
  );
}
