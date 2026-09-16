import { supabase } from "./supabaseClient";

// Busca todos os parâmetros salvos de um produto. Retorna um objeto
// { "machineId.fieldKey": valor }. Campos sem valor salvo ainda
// simplesmente não aparecem no objeto — quem lê trata isso como vazio.
export async function fetchParameters(productKey) {
  const { data, error } = await supabase
    .from("parametros")
    .select("machine_id, field_key, value")
    .eq("product_key", productKey);

  if (error) {
    console.error("Erro ao buscar parâmetros:", error);
    return {};
  }

  const values = {};
  for (const row of data) {
    const key = `${row.machine_id}.${row.field_key}`;
    try {
      values[key] = JSON.parse(row.value);
    } catch {
      values[key] = row.value;
    }
  }
  return values;
}

// Copia TODOS os parâmetros de um produto para outro. Por padrão só
// preenche o que ainda está vazio no destino (`overwrite: false`);
// com `overwrite: true`, substitui tudo.
// Retorna quantos valores foram copiados.
export async function copyParameters(fromProductKey, toProductKey, { overwrite = false } = {}) {
  const { data: origem, error } = await supabase
    .from("parametros")
    .select("machine_id, field_key, value")
    .eq("product_key", fromProductKey);

  if (error) {
    console.error("Erro ao ler parâmetros de origem:", error);
    throw error;
  }
  if (!origem?.length) return 0;

  let paraCopiar = origem;

  if (!overwrite) {
    // Descobre o que o destino já tem, pra não sobrescrever ajustes
    // que já foram feitos nele.
    const { data: destino } = await supabase
      .from("parametros")
      .select("machine_id, field_key")
      .eq("product_key", toProductKey);

    const jaExiste = new Set((destino ?? []).map((r) => `${r.machine_id}.${r.field_key}`));
    paraCopiar = origem.filter((r) => !jaExiste.has(`${r.machine_id}.${r.field_key}`));
  }

  if (!paraCopiar.length) return 0;

  const agora = new Date().toISOString();
  const linhas = paraCopiar.map((r) => ({
    product_key: toProductKey,
    machine_id: r.machine_id,
    field_key: r.field_key,
    value: r.value,
    updated_at: agora,
  }));

  const { error: erroEscrita } = await supabase
    .from("parametros")
    .upsert(linhas, { onConflict: "product_key,machine_id,field_key" });

  if (erroEscrita) {
    console.error("Erro ao copiar parâmetros:", erroEscrita);
    throw erroEscrita;
  }

  return linhas.length;
}
export async function saveParameter(productKey, machineId, fieldKey, value) {
  const { error } = await supabase.from("parametros").upsert(
    {
      product_key: productKey,
      machine_id: machineId,
      field_key: fieldKey,
      value: JSON.stringify(value),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "product_key,machine_id,field_key" }
  );

  if (error) {
    console.error("Erro ao salvar parâmetro:", error);
    throw error;
  }
}
