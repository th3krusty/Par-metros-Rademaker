import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkAdminPassword } from "../lib/auth";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = await checkAdminPassword(password);
    setLoading(false);
    if (ok) {
      navigate("/admin/painel");
    } else {
      setError("Senha incorreta.");
    }
  }

  return (
    <div className="admin-login-screen">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <h1 className="admin-login-title">Área do administrador</h1>
        <p className="admin-login-subtitle">Digite a senha para editar os parâmetros</p>
        <input
          type="password"
          className="admin-login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          autoFocus
        />
        {error && <p className="admin-login-error">{error}</p>}
        <button type="submit" className="admin-login-button" disabled={loading}>
          {loading ? "Verificando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
