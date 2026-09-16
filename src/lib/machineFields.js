import { supabase } from "./supabaseClient";

// Busca a definição dos campos de uma máquina (o que existe, tipo,
// unidade, descrição) — vem do banco pra poder ser editado pelo admin.
export async function fetchMachineFields(machineId) {
  const { data, error } = await supabase
    .from("machine_fields")
    .select("*")
    .eq("machine_id", machineId)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Erro ao buscar campos da máquina:", error);
    return [];
  }

  return data.map((row) => ({
    key: row.field_key,
    label: row.label,
    type: row.type,
    unit: row.unit,
    description: row.description,
    options: row.options?.count !== undefined ? undefined : row.options,
    count: row.options?.count,
    orderIndex: row.order_index,
  }));
}

// Cria um novo campo para uma máquina.
export async function addMachineField(machineId, field) {
  const { data: existing } = await supabase
    .from("machine_fields")
    .select("order_index")
    .eq("machine_id", machineId)
    .order("order_index", { ascending: false })
    .limit(1);

  const nextOrder = existing?.length ? existing[0].order_index + 1 : 0;

  let options = null;
  if (field.type === "lever_group" || field.type === "manipulo") {
    options = { count: Number(field.count) || 1 };
  } else if ((field.type === "toggle" || field.type === "radio") && field.optionsText) {
    options = field.optionsText.split(",").map((s) => s.trim()).filter(Boolean);
  }

  const { error } = await supabase.from("machine_fields").insert({
    machine_id: machineId,
    field_key: field.key,
    label: field.label,
    type: field.type,
    unit: field.unit ?? "",
    options,
    description: field.description || null,
    order_index: nextOrder,
  });

  if (error) {
    console.error("Erro ao adicionar campo:", error);
    throw error;
  }
}

// Remove um campo de uma máquina (não apaga os valores já salvos em
// `parametros` — eles ficam órfãos, sem efeito, e podem ser limpos
// depois se quiser).
export async function deleteMachineField(machineId, fieldKey) {
  const { error } = await supabase
    .from("machine_fields")
    .delete()
    .eq("machine_id", machineId)
    .eq("field_key", fieldKey);

  if (error) {
    console.error("Erro ao excluir campo:", error);
    throw error;
  }
}
