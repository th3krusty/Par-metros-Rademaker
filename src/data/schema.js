// Estrutura de produtos e seções (Linhas) da máquina.
//
// Os CAMPOS de parâmetro de cada máquina (o que existe, tipo, unidade,
// descrição) NÃO ficam mais fixos aqui — eles vêm do Supabase (tabela
// `machine_fields`), pra poderem ser adicionados/excluídos pela própria
// tela de admin. Aqui só ficam a lista de máquinas de cada seção (id,
// nome, descrição fixa e referência ao manual, quando já mapeada).
//
// Os VALORES de cada campo, por produto, também vêm do Supabase
// (tabela `parametros`).
// O ícone/foto de cada máquina vem do Supabase (tabela `machine_icons`).

// Produtos que o operador pode selecionar na tela inicial.
// Produtos com `variants` abrem uma segunda tela de seleção.
export const PRODUCTS = [
  {
    id: "pao_frances",
    label: "Pão Francês",
    variants: [
      { id: "pao_frances_75g", label: "75g" },
      { id: "pao_frances_90g", label: "90g" },
    ],
  },
  {
    id: "pao_cara",
    label: "Pão Cará",
    variants: null,
  },
  {
    id: "pao_hotdog",
    label: "Pão Hot-dog",
    variants: [
      { id: "pao_hotdog_padrao", label: "Hot-dog" },
      { id: "pao_hotdog_mini", label: "Mini Hot-Dog" },
    ],
  },
];

// Retorna a lista plana de "produto final" (com variante resolvida),
// usada como chave de armazenamento dos parâmetros.
export function getAllProductVariants() {
  const out = [];
  for (const p of PRODUCTS) {
    if (p.variants) {
      for (const v of p.variants) {
        out.push({ productKey: v.id, label: `${p.label} ${v.label}` });
      }
    } else {
      out.push({ productKey: p.id, label: p.label });
    }
  }
  return out;
}

// As 3 seções da linha (correspondem às abas "1", "2", "3" da IHM).
export const SECTIONS = [
  { id: "linha1", label: "Linha 1" },
  { id: "linha2", label: "Linha 2" },
  { id: "linha3", label: "Linha 3" },
];

// Máquinas de cada seção, na ordem em que aparecem no diagrama da linha
// (ordem física real do equipamento).
export const MACHINES = {
  linha1: [
    { id: "cortador_pedacos1", label: "Cortador de pedaços 1" },
    { id: "laminacao_premassa1", label: "Máquina de laminação pré-massa 1" },
    {
      id: "lss1",
      label: "LSS 1",
      description:
        "Laminadora de baixa tensão (LSS) — reduz a espessura da massa entre rolos superiores e inferiores, controlando a folga entre eles.",
    },
    { id: "reducao_rapida1", label: "Redução rápida 1" },
    { id: "camadas1", label: "Equipamento de fazer camadas 1" },
  ],
  linha2: [
    { id: "reducao_rapida1_l2", label: "Redução rápida 1" },
    { id: "rolos_medicao1", label: "Rolos de medição 1" },
    { id: "retorno_massa1", label: "Retorno de massa 1" },
  ],
  linha3: [
    { id: "espalhar_conveyor1", label: "Espalhar conveyor 1" },
    { id: "trabalho_guilhotina2", label: "Trabalho guilhotina 2" },
    { id: "guilhotina_mecanica1", label: "Guilhotina mecânica 1" },
    {
      id: "enroladora_r2013",
      label: "Enroladora R-2013: 1",
      manualRef: "Manual Rademaker, seção 9.22 — \"Moldadora em R\" (nome diferente na IHM)",
      description:
        "Enrola as porções de massa usando dois tapetes que giram em direções opostas. A diferença de velocidade entre os tapetes faz o enrolamento. As alavancas são os manípulos físicos da máquina que ajustam a firmeza do rolo, a altura de queda e a posição do produto na saída — os valores de referência ficam salvos por receita.",
    },
    { id: "rolo_pressao1", label: "Rolo de pressão 1" },
    { id: "esteira6", label: "Esteira de Transporte 6" },
    { id: "esteira5", label: "Esteira de Transporte 5" },
    { id: "esteira4", label: "Esteira de Transporte 4" },
    { id: "esteira3", label: "Esteira de Transporte 3" },
  ],
};

export const FIELD_TYPES = {
  NUMBER: "number",
  TOGGLE: "toggle",
  RADIO: "radio",
  LEVER_GROUP: "lever_group",
  MANIPULO: "manipulo", // volante de ajuste manual Rademaker (visual de disco)
};
