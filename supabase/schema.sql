-- Café & Memória — tabela de avaliações
-- Execute no Supabase: SQL Editor → New query → cole e rode.

create table if not exists public.avaliacoes (
  id            uuid primary key,                 -- gerado no aparelho; impede envio duplicado
  nome          text not null check (char_length(nome) between 2 and 120),
  email         text check (email is null or char_length(email) <= 160),
  guias         text[] not null default '{}',
  nota_geral    smallint not null check (nota_geral between 1 and 5),
  notas_guias   jsonb not null,                   -- {clareza, dominio, comunicacao, organizacao, interesse}: 1..5
  conteudo      jsonb not null,                   -- {compreensao, interesse, tempo}: sim | parcialmente | nao
  recomendacao  smallint not null check (recomendacao between 0 and 10),
  marcante      text not null check (char_length(marcante) between 3 and 1000),
  sugestao      text check (sugestao is null or char_length(sugestao) <= 600),
  aprender      text check (aprender is null or char_length(aprender) <= 600),
  enviado_em    timestamptz not null default now(),
  recebido_em   timestamptz not null default now()
);

alter table public.avaliacoes enable row level security;

-- Participantes (anônimos) só podem INSERIR. Não leem, não alteram, não apagam.
drop policy if exists "participantes inserem" on public.avaliacoes;
create policy "participantes inserem"
  on public.avaliacoes for insert
  to anon, authenticated
  with check (true);

-- Leitura apenas para usuários logados (a equipe do trabalho).
-- Crie os usuários em Authentication → Users → Add user (e desative cadastro público
-- em Authentication → Providers → Email → "Allow new users to sign up").
drop policy if exists "equipe le" on public.avaliacoes;
create policy "equipe le"
  on public.avaliacoes for select
  to authenticated
  using (true);
