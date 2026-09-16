import { supabase } from "./supabaseClient";

// Busca a foto/ícone de uma máquina (data URL base64), ou null se
// ainda não foi enviada nenhuma.
export async function fetchMachineIcon(machineId) {
  const { data, error } = await supabase
    .from("machine_icons")
    .select("image_data")
    .eq("machine_id", machineId)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar ícone da máquina:", error);
    return null;
  }
  return data?.image_data ?? null;
}

// Busca os ícones de todas as máquinas de uma vez (pra tela do
// diagrama, que mostra várias máquinas ao mesmo tempo).
export async function fetchAllMachineIcons() {
  const { data, error } = await supabase.from("machine_icons").select("machine_id, image_data");
  if (error) {
    console.error("Erro ao buscar ícones:", error);
    return {};
  }
  const map = {};
  for (const row of data) map[row.machine_id] = row.image_data;
  return map;
}

// Salva (upsert) a foto de uma máquina. `file` é um File vindo de um
// <input type="file">; convertemos pra data URL base64 antes de salvar.
export async function saveMachineIcon(machineId, file) {
  const dataUrl = await fileToDataUrl(file);
  const { error } = await supabase.from("machine_icons").upsert(
    { machine_id: machineId, image_data: dataUrl, updated_at: new Date().toISOString() },
    { onConflict: "machine_id" }
  );
  if (error) {
    console.error("Erro ao salvar ícone:", error);
    throw error;
  }
}

export async function removeMachineIcon(machineId) {
  const { error } = await supabase.from("machine_icons").delete().eq("machine_id", machineId);
  if (error) {
    console.error("Erro ao remover ícone:", error);
    throw error;
  }
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
