-- SHOW DO JORJÃO V16 — perfis oficiais e fotos sincronizadas
-- Execute uma única vez no SQL Editor do Supabase.

-- 1) Campo para guardar a URL pública da foto do jogador.
alter table public.players add column if not exists avatar_url text;

-- 2) Permitir que o navegador atualize somente a coluna avatar_url.
grant update (avatar_url) on public.players to anon, authenticated;

drop policy if exists "Atualizar foto de jogador oficial" on public.players;
create policy "Atualizar foto de jogador oficial"
on public.players for update to anon, authenticated
using (is_official = true)
with check (is_official = true);

-- 3) Bucket público: as imagens podem ser visualizadas em qualquer dispositivo.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('player-avatars', 'player-avatars', true, 8388608, array['image/webp'])
on conflict (id) do update set
  public = true,
  file_size_limit = 8388608,
  allowed_mime_types = array['image/webp'];

-- 4) Leitura pública das fotos.
drop policy if exists "Fotos de perfil oficiais são públicas" on storage.objects;
create policy "Fotos de perfil oficiais são públicas"
on storage.objects for select to anon, authenticated
using (bucket_id = 'player-avatars');

-- 5) Upload apenas em pastas cujo primeiro segmento seja o ID de jogador oficial.
drop policy if exists "Enviar foto para jogador oficial" on storage.objects;
create policy "Enviar foto para jogador oficial"
on storage.objects for insert to anon, authenticated
with check (
  bucket_id = 'player-avatars'
  and exists (
    select 1 from public.players p
    where p.id::text = (storage.foldername(name))[1]
      and p.is_official = true
  )
);

-- 6) Substituir a foto existente do mesmo jogador.
drop policy if exists "Substituir foto de jogador oficial" on storage.objects;
create policy "Substituir foto de jogador oficial"
on storage.objects for update to anon, authenticated
using (
  bucket_id = 'player-avatars'
  and exists (
    select 1 from public.players p
    where p.id::text = (storage.foldername(name))[1]
      and p.is_official = true
  )
)
with check (
  bucket_id = 'player-avatars'
  and exists (
    select 1 from public.players p
    where p.id::text = (storage.foldername(name))[1]
      and p.is_official = true
  )
);


-- 7) Estatísticas acumuladas por categoria (somente jogadores oficiais).
create table if not exists public.player_category_stats (
  player_id uuid not null references public.players(id) on delete cascade,
  category text not null,
  answered integer not null default 0 check (answered >= 0),
  correct integer not null default 0 check (correct >= 0),
  total_points integer not null default 0 check (total_points >= 0),
  response_seconds numeric(12,3) not null default 0 check (response_seconds >= 0),
  updated_at timestamptz not null default now(),
  primary key (player_id, category),
  check (correct <= answered)
);

alter table public.player_category_stats enable row level security;
drop policy if exists "Leitura pública de desempenho por categoria" on public.player_category_stats;
create policy "Leitura pública de desempenho por categoria"
on public.player_category_stats for select to anon, authenticated using (true);
grant select on public.player_category_stats to anon, authenticated;

-- A gravação é feita por RPC ao final da partida. A pontuação principal não depende desta função.
create or replace function public.record_player_category_stats(
  p_player_id uuid,
  p_category text,
  p_answered integer,
  p_correct integer,
  p_points integer,
  p_response_seconds numeric
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.players where id = p_player_id and is_official = true) then
    raise exception 'Jogador oficial não encontrado';
  end if;
  if trim(coalesce(p_category, '')) = '' or greatest(coalesce(p_answered,0),0) = 0 then
    return;
  end if;
  insert into public.player_category_stats
    (player_id, category, answered, correct, total_points, response_seconds, updated_at)
  values
    (p_player_id, trim(p_category), greatest(coalesce(p_answered,0),0),
     least(greatest(coalesce(p_correct,0),0),greatest(coalesce(p_answered,0),0)),
     greatest(coalesce(p_points,0),0), greatest(coalesce(p_response_seconds,0),0), now())
  on conflict (player_id, category) do update set
    answered = public.player_category_stats.answered + excluded.answered,
    correct = public.player_category_stats.correct + excluded.correct,
    total_points = public.player_category_stats.total_points + excluded.total_points,
    response_seconds = public.player_category_stats.response_seconds + excluded.response_seconds,
    updated_at = now();
end;
$$;

revoke all on function public.record_player_category_stats(uuid,text,integer,integer,integer,numeric) from public;
grant execute on function public.record_player_category_stats(uuid,text,integer,integer,integer,numeric) to anon, authenticated;
