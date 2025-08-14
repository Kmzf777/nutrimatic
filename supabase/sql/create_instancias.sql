-- Tabela: public.instancias
-- Assumindo que o segundo created_at é updated_at
-- Campos:
--   id (uuid, PK)
--   created_at (timestamptz)
--   updated_at (timestamptz)
--   identificacao (uuid -> nutricionistas.id)
--   name (text)
--   number (text)
--   status (text: 'ativo' | 'inativo' | 'pendente')

create extension if not exists pgcrypto;

create table if not exists public.instancias (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  identificacao uuid not null references public.nutricionistas(id) on delete cascade,
  name text not null,
  number text not null,
  status text not null default 'ativo' check (status in ('ativo','inativo','pendente'))
);

-- Índices úteis
create index if not exists instancias_identificacao_idx on public.instancias (identificacao);
create index if not exists instancias_created_at_idx on public.instancias (created_at desc);

-- Trigger para manter updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists instancias_set_updated_at on public.instancias;
create trigger instancias_set_updated_at
before update on public.instancias
for each row execute function public.set_updated_at();

-- RLS e Policies
alter table public.instancias enable row level security;

-- SELECT: o usuário só vê suas próprias instâncias
drop policy if exists "instancias_select_own" on public.instancias;
create policy "instancias_select_own" on public.instancias
  for select
  to authenticated
  using (identificacao = auth.uid());

-- INSERT: o usuário só cria com sua própria identificacao
drop policy if exists "instancias_insert_own" on public.instancias;
create policy "instancias_insert_own" on public.instancias
  for insert
  to authenticated
  with check (identificacao = auth.uid());

-- UPDATE: o usuário só atualiza suas próprias instâncias
drop policy if exists "instancias_update_own" on public.instancias;
create policy "instancias_update_own" on public.instancias
  for update
  to authenticated
  using (identificacao = auth.uid())
  with check (identificacao = auth.uid());

-- DELETE: o usuário só deleta suas próprias instâncias
drop policy if exists "instancias_delete_own" on public.instancias;
create policy "instancias_delete_own" on public.instancias
  for delete
  to authenticated
  using (identificacao = auth.uid());


