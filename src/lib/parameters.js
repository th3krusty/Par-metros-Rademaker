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

// Salva (upsert) um único campo de parâmetro para um produto.
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
