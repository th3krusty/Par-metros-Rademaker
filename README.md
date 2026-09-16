# Painel de Parâmetros da Máquina

Web app interno para visualizar e editar os parâmetros de cada produto
(Pão Francês 75g/90g, Pão Cará, Pão Hot-dog, Mini Hot-Dog) nas 3 seções
da linha de produção, com página pública de consulta e uma área de
administrador protegida por senha para editar os valores.

## O que já está pronto

- Tela inicial de seleção de produto (com sub-seleção pra Pão Francês e Pão Hot-dog)
- Diagrama da linha com abas Linha 1 / Linha 2 / Linha 3, com os equipamentos clicáveis
- **Foto de cada equipamento**: o círculo do diagrama fica vazio até você subir uma foto —
  faça isso na tela de admin, escolhendo a máquina e clicando em "Enviar foto"
- **Campos editáveis pela própria tela de admin**: cada máquina tem uma seção
  "Gerenciar campos desta máquina" onde dá pra adicionar um novo parâmetro (nome, tipo,
  unidade, opções) ou excluir um campo existente — não precisa mais mexer em código
- Tela de parâmetros de cada equipamento (visão pública, somente leitura), com ícone de
  explicação (ⓘ) onde já temos a descrição do manual
- Área de administrador (`/admin`) com login por senha
- Todos os campos mapeados das fotos da IHM já cadastrados via seed inicial no banco
- Explicações do manual Rademaker já incluídas para a "Enroladora R-2013"
  (moldadora em R / alavancas) — as demais máquinas ainda estão sem descrição
  detalhada (dá pra ir completando pela própria tela de admin, campo "Explicação")

## Passo 1 — Criar o projeto no Supabase

1. Crie um projeto em https://supabase.com (grátis)
2. Vá em **SQL Editor** e rode o conteúdo do arquivo `supabase-schema.sql`
   (cria as tabelas `parametros` e `admin_config`, já com uma senha padrão)
3. Vá em **Project Settings → API** e copie:
   - `Project URL`
   - `anon public key`

## Passo 2 — Configurar as variáveis de ambiente

Copie `.env.example` para `.env` e preencha com os dados do passo 1:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

## Passo 3 — Rodar localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`. A senha de admin padrão é `admin123`
(troque assim que possível — veja abaixo).

## Trocar a senha do admin

```bash
node scripts/gerar-hash-senha.mjs "suaSenhaNova"
```

O script imprime o comando SQL pronto pra rodar no SQL Editor do Supabase.

## Deploy (Vercel, seguindo seu padrão em tkone.com.br)

1. Suba o projeto pro GitHub
2. Importe na Vercel
3. Configure as variáveis de ambiente `VITE_SUPABASE_URL` e
   `VITE_SUPABASE_ANON_KEY` no painel da Vercel (Settings → Environment Variables)
4. O `vite.config.js` já está configurado com `base: '/painel-parametros/'`
   e o `vercel.json` com o rewrite — ajuste o subpath em ambos os arquivos
   se quiser outro nome
5. Configure o rewrite proxy em `tkone.com.br` apontando `/painel-parametros/*`
   pra esse projeto (mesmo padrão que você já usa nos outros)
6. Todo push na branch principal já faz o deploy automático

## O que ainda falta pra ficar 100% completo

- **Fotos dos equipamentos**: os círculos do diagrama começam vazios — suba as fotos
  reais dos símbolos da IHM pela tela de admin, uma vez que estiver com o banco configurado
- **Descrições do manual**: só a "Enroladora R-2013" (moldadora em R) tem
  explicação detalhada por enquanto. As demais máquinas (Divisora, LSS,
  Cortador de pedaços, Guilhotina, etc.) ainda precisam ser cruzadas com
  o manual — dá pra ir preenchendo pelo campo "Explicação" ao adicionar/editar
  campos na tela de admin, ou me avisa que eu vou completando
- **Segurança da escrita**: a proteção de quem pode editar hoje é só a senha
  na tela `/admin` — o banco aceita escrita de qualquer requisição com a
  chave pública (comum em apps internos simples). Se um dia quiser algo mais
  robusto, dá pra migrar pra Supabase Auth + política de RLS por usuário
- **Conferência do mapeamento**: como os nomes das máquinas no manual são
  diferentes dos nomes na IHM, o cruzamento foi feito seção por seção —
  vale uma conferida rápida sua nas descrições que forem sendo adicionadas

## Estrutura do projeto

```
src/
  data/schema.js         → produtos, seções e a lista de máquinas de cada uma (estrutura fixa)
  lib/supabaseClient.js  → conexão com o Supabase
  lib/parameters.js      → busca/salva valores de parâmetros
  lib/machineFields.js   → busca/adiciona/exclui os CAMPOS de cada máquina (vem do banco)
  lib/machineIcons.js    → busca/salva a foto de cada máquina (vem do banco)
  lib/auth.js            → login do admin (hash de senha)
  components/            → peças de UI reutilizáveis (inclui FieldManager e IconUploader)
  pages/                 → as telas (seleção, diagrama, parâmetros, admin)
```
