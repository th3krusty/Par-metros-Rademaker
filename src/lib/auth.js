import { supabase } from "./supabaseClient";

const SESSION_KEY = "painel_admin_autenticado";

export async function sha256Hex(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Compara a senha digitada com o hash salvo na tabela `admin_config`.
export async function checkAdminPassword(password) {
  const { data, error } = await supabase
    .from("admin_config")
    .select("password_hash")
    .eq("id", 1)
    .single();

  if (error || !data) {
    console.error("Erro ao verificar senha de admin:", error);
    return false;
  }

  const hash = await sha256Hex(password);
  const ok = hash === data.password_hash;
  if (ok) {
    sessionStorage.setItem(SESSION_KEY, "1");
  }
  return ok;
}

export function isAdminLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

export function logoutAdmin() {
  sessionStorage.removeItem(SESSION_KEY);
}
