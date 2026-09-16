-- Rode este script no SQL Editor do seu projeto Supabase
-- (https://app.supabase.com/project/_/sql)

-- Tabela de definição de campos de cada máquina (o que existe, tipo,
-- unidade, descrição). Editável pela tela de admin (adicionar/excluir
-- campos) — por isso fica no banco, e não fixo no código.
create table if not exists machine_fields (
  id bigint generated always as identity primary key,
  machine_id text not null,
  field_key text not null,
  label text not null,
  type text not null default 'number', -- number | toggle | radio | lever_group
  unit text default '',
  options jsonb, -- array de opções (toggle/radio) ou {count} (lever_group)
  description text,
  order_index int not null default 0,
  unique (machine_id, field_key)
);

-- Ícone/foto de cada máquina (imagem enviada pelo admin), guardada como
-- data URL base64. Se não houver linha para uma máquina, o círculo
-- aparece vazio no diagrama.
create table if not exists machine_icons (
  machine_id text primary key,
  image_data text not null,
  updated_at timestamptz not null default now()
);

-- Tabela de valores de parâmetros: um valor por combinação de produto + máquina + campo
create table if not exists parametros (
  id bigint generated always as identity primary key,
  product_key text not null,
  machine_id text not null,
  field_key text not null,
  value text not null default '""',
  updated_at timestamptz not null default now(),
  unique (product_key, machine_id, field_key)
);

-- Tabela de configuração do admin (senha em hash SHA-256)
create table if not exists admin_config (
  id bigint primary key,
  password_hash text not null
);

-- Senha padrão inicial: "admin123"
-- IMPORTANTE: troque depois de configurar! Use scripts/gerar-hash-senha.mjs
insert into admin_config (id, password_hash)
values (1, '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9')
on conflict (id) do nothing;

-- Row Level Security: leitura pública (tela do operador) e escrita
-- liberada (tela de admin, protegida por senha no app, não no banco —
-- é um app de uso interno; veja o README pra uma alternativa mais
-- robusta com Supabase Auth, se quiser no futuro).
alter table parametros enable row level security;
alter table admin_config enable row level security;
alter table machine_fields enable row level security;
alter table machine_icons enable row level security;

drop policy if exists "Leitura pública de parâmetros" on parametros;
drop policy if exists "Escrita de parâmetros" on parametros;
drop policy if exists "Atualização de parâmetros" on parametros;
drop policy if exists "Leitura do hash de senha" on admin_config;
drop policy if exists "Leitura pública de campos" on machine_fields;
drop policy if exists "Inserção de campos" on machine_fields;
drop policy if exists "Atualização de campos" on machine_fields;
drop policy if exists "Exclusão de campos" on machine_fields;
drop policy if exists "Leitura pública de ícones" on machine_icons;
drop policy if exists "Inserção de ícones" on machine_icons;
drop policy if exists "Atualização de ícones" on machine_icons;

create policy "Leitura pública de parâmetros" on parametros for select using (true);
create policy "Escrita de parâmetros" on parametros for insert with check (true);
create policy "Atualização de parâmetros" on parametros for update using (true);

create policy "Leitura do hash de senha" on admin_config for select using (true);

create policy "Leitura pública de campos" on machine_fields for select using (true);
create policy "Inserção de campos" on machine_fields for insert with check (true);
create policy "Atualização de campos" on machine_fields for update using (true);
create policy "Exclusão de campos" on machine_fields for delete using (true);

create policy "Leitura pública de ícones" on machine_icons for select using (true);
create policy "Inserção de ícones" on machine_icons for insert with check (true);
create policy "Atualização de ícones" on machine_icons for update using (true);

-- Seed inicial dos campos de cada máquina, com base no que já foi
-- mapeado nas fotos da IHM. Depois disso, adicionar/excluir campos vira
-- tudo pela tela de admin.
insert into machine_fields (machine_id, field_key, label, type, unit, options, description, order_index) values
('cortador_pedacos1', 'velocidade_rpm', 'Velocidade', 'number', 'rpm', null, null, 0),
('cortador_pedacos1', 'atraso_paragem', 'Atraso de paragem', 'number', 's', null, null, 1),
('cortador_pedacos1', 'tempo_inversao', 'Tempo de inversão', 'number', 's', null, null, 2),
('laminacao_premassa1', 'dimensao', 'Dimensão', 'number', 'mm', null, null, 0),
('laminacao_premassa1', 'velocidade_pct', 'Velocidade', 'number', '%', null, null, 1),
('laminacao_premassa1', 'velocidade_mmin', 'Velocidade', 'number', 'm/min', null, null, 2),
('laminacao_premassa1', 'folga', 'Folga', 'number', 'mm', null, null, 3),
('laminacao_premassa1', 'rolo_pressao_pct', 'Rolo de pressão', 'number', '%', null, null, 4),
('laminacao_premassa1', 'rolo_pressao_mmin', 'Rolo de pressão', 'number', 'm/min', null, null, 5),
('laminacao_premassa1', 'nivel_massa_lss', 'Nível de massa LSS', 'toggle', '', '["Sólido","Outro"]'::jsonb, null, 6),
('lss1', 'rolos_sup_pct', 'Rolos superiores', 'number', '%', null, null, 0),
('lss1', 'rolos_sup_mm', 'Rolos superiores', 'number', 'mm', null, null, 1),
('lss1', 'modo_superior', 'Modo rolos superiores', 'toggle', '', '["Velocidade","Nível de massa"]'::jsonb, null, 2),
('lss1', 'rolos_sup_mmin', 'Rolos superiores', 'number', 'm/min', null, null, 3),
('lss1', 'folga', 'Folga', 'number', 'mm', null, null, 4),
('lss1', 'rolos_inf_pct', 'Rolos inferiores', 'number', '%', null, null, 5),
('lss1', 'modo_inferior', 'Modo rolos inferiores', 'toggle', '', '["Sólido","Líquido"]'::jsonb, null, 6),
('lss1', 'rolos_inf_mmin', 'Rolos inferiores', 'number', 'm/min', null, null, 7),
('reducao_rapida1', 'alimentacao_pct', 'Alimentação', 'number', '%', null, null, 0),
('reducao_rapida1', 'alimentacao_mmin', 'Alimentação', 'number', 'm/min', null, null, 1),
('reducao_rapida1', 'rolos_superiores_pct', 'Rolos superiores', 'number', '%', null, null, 2),
('reducao_rapida1', 'folga', 'Folga', 'number', 'mm', null, null, 3),
('reducao_rapida1', 'inferiores_automatico', 'Inferiores rol — Automático', 'toggle', '', '["Manual","Automático"]'::jsonb, null, 4),
('reducao_rapida1', 'inferiores_pct1', 'Inferiores rol', 'number', '%', null, null, 5),
('reducao_rapida1', 'inferiores_pct2', 'Inferiores rol (2)', 'number', '%', null, null, 6),
('reducao_rapida1', 'inferiores_mmin', 'Inferiores rol', 'number', 'm/min', null, null, 7),
('camadas1', 'tela_alimentacao', 'Tela de alimentação', 'number', 'm/min', null, null, 0),
('camadas1', 'numero_camadas', 'Número de camadas', 'radio', '', '[2,4,6,8,10,12]'::jsonb, null, 1),
('camadas1', 'correcao', 'Correção', 'number', '', null, null, 2),
('camadas1', 'posicao_1', 'Posição 1', 'number', 'mm', null, null, 3),
('camadas1', 'posicao_2', 'Posição 2', 'number', 'mm', null, null, 4),
('camadas1', 'movimento', 'Movimento', 'number', '%', null, null, 5),
('reducao_rapida1_l2', 'alimentacao_pct', 'Alimentação', 'number', '%', null, null, 0),
('reducao_rapida1_l2', 'alimentacao_mmin', 'Alimentação', 'number', 'm/min', null, null, 1),
('reducao_rapida1_l2', 'rolos_superiores_pct', 'Rolos superiores', 'number', '%', null, null, 2),
('reducao_rapida1_l2', 'folga', 'Folga', 'number', 'mm', null, null, 3),
('reducao_rapida1_l2', 'inferiores_automatico', 'Inferiores rol — Automático', 'toggle', '', '["Manual","Automático"]'::jsonb, null, 4),
('reducao_rapida1_l2', 'inferiores_pct1', 'Inferiores rol', 'number', '%', null, null, 5),
('reducao_rapida1_l2', 'inferiores_pct2', 'Inferiores rol (2)', 'number', '%', null, null, 6),
('reducao_rapida1_l2', 'inferiores_mmin', 'Inferiores rol', 'number', 'm/min', null, null, 7),
('rolos_medicao1', 'alimentacao_automatico', 'Alimentação — Automático', 'toggle', '', '["Manual","Automático"]'::jsonb, null, 0),
('rolos_medicao1', 'alimentacao_pct', 'Alimentação', 'number', '%', null, null, 1),
('rolos_medicao1', 'alimentacao_mmin', 'Alimentação', 'number', 'm/min', null, null, 2),
('rolos_medicao1', 'folga', 'Folga', 'number', 'mm', null, null, 3),
('rolos_medicao1', 'rolos_pct', 'Rolos', 'number', '%', null, null, 4),
('rolos_medicao1', 'rolos_mmin', 'Rolos', 'number', 'm/min', null, null, 5),
('retorno_massa1', 'velocidade_pct', 'Velocidade', 'number', '%', null, null, 0),
('retorno_massa1', 'velocidade_mmin', 'Velocidade', 'number', 'm/min', null, null, 1),
('espalhar_conveyor1', 'velocidade_pct', 'Velocidade', 'number', '%', null, null, 0),
('espalhar_conveyor1', 'velocidade_mmin', 'Velocidade', 'number', 'm/min', null, null, 1),
('trabalho_guilhotina2', 'velocidade_mmin', 'Velocidade', 'number', 'm/min', null, null, 0),
('guilhotina_mecanica1', 'velocidade_pct', 'Velocidade', 'number', '%', null, null, 0),
('guilhotina_mecanica1', 'velocidade_rpm', 'Velocidade', 'number', 'rpm', null, null, 1),
('guilhotina_mecanica1', 'comprimento_corte', 'Comprimento de corte', 'number', 'mm', null, null, 2),
('guilhotina_mecanica1', 'modo_corte', 'Modo de corte', 'toggle', '', '["Contínuo","Intervalado"]'::jsonb, null, 3),
('guilhotina_mecanica1', 'fator_divisao', 'Fator de divisão', 'number', '', null, null, 4),
('enroladora_r2013', 'enroladora_pct', 'Enroladora', 'number', '%', null, 'Velocidade da moldadora em relação ao tapete de alimentação. A 100%, o rolo superior gira 50% mais rápido que o tapete de alimentação.', 0),
('enroladora_r2013', 'enroladora_mmin', 'Enroladora', 'number', 'm/min', null, null, 1),
('enroladora_r2013', 'rolos_inferiores_pct', 'Rolos inferiores', 'number', '%', null, 'Velocidade do rolo inferior em relação ao rolo superior. A 100%, a relação é 1:1,25.', 2),
('enroladora_r2013', 'rolos_inferiores_mmin', 'Rolos inferiores', 'number', 'm/min', null, null, 3),
('enroladora_r2013', 'esteira_pct', 'Esteira', 'number', '%', null, 'Velocidade do tapete superior em relação ao rolo superior. Aumentar acelera o tapete; diminuir reduz sua velocidade relativa.', 4),
('enroladora_r2013', 'esteira_mmin', 'Esteira', 'number', 'm/min', null, null, 5),
('enroladora_r2013', 'alavancas', 'Alavancas', 'lever_group', '', '{"count":5}'::jsonb, 'Manípulos físicos #2 a #5 da moldadora. Controlam a firmeza do enrolamento (distância tapete/cassete — quanto menor, mais firme), a altura traseira da mesa de moldagem (afeta a queda para o próximo tapete) e a posição do bico do produto na saída. Os valores aqui são de referência para o ajuste manual na máquina.', 6),
('rolo_pressao1', 'velocidade_pct', 'Velocidade', 'number', '%', null, null, 0),
('rolo_pressao1', 'velocidade_mmin', 'Velocidade', 'number', 'm/min', null, null, 1),
('rolo_pressao1', 'folga', 'Folga', 'number', 'mm', null, null, 2),
('esteira6', 'velocidade_pct', 'Velocidade', 'number', '%', null, null, 0),
('esteira6', 'velocidade_mmin', 'Velocidade', 'number', 'm/min', null, null, 1),
('esteira5', 'velocidade_pct', 'Velocidade', 'number', '%', null, null, 0),
('esteira5', 'velocidade_mmin', 'Velocidade', 'number', 'm/min', null, null, 1),
('esteira4', 'velocidade_pct', 'Velocidade', 'number', '%', null, null, 0),
('esteira4', 'velocidade_mmin', 'Velocidade', 'number', 'm/min', null, null, 1),
('esteira3', 'velocidade_pct', 'Velocidade', 'number', '%', null, null, 0),
('esteira3', 'velocidade_mmin', 'Velocidade', 'number', 'm/min', null, null, 1),
('esteira3', 'lever_1', 'Alavanca 1', 'number', '', null, null, 2),
('esteira3', 'lever_2', 'Alavanca 2', 'number', '', null, null, 3)
on conflict (machine_id, field_key) do nothing;

