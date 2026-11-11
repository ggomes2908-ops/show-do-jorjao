-- SHOW DO JORJÃO — configuração do Hall da Fama global e bloqueio global de perguntas
-- Execute este script no SQL Editor do seu projeto Supabase.

create table if not exists public.hall_of_fame (
  player_name text primary key,
  normalized_name text unique not null,
  games integer not null default 0,
  wins integer not null default 0,
  answered integer not null default 0,
  correct integer not null default 0,
  total_points integer not null default 0,
  best_streak integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.used_questions (
  question_id text primary key,
  used_at timestamptz not null default now()
);

alter table public.hall_of_fame enable row level security;
alter table public.used_questions enable row level security;

drop policy if exists "Hall publico para leitura" on public.hall_of_fame;
create policy "Hall publico para leitura"
on public.hall_of_fame for select to anon, authenticated using (true);

drop policy if exists "Perguntas usadas publicas para leitura" on public.used_questions;
create policy "Perguntas usadas publicas para leitura"
on public.used_questions for select to anon, authenticated using (true);

drop policy if exists "Registrar perguntas usadas publicamente" on public.used_questions;
create policy "Registrar perguntas usadas publicamente"
on public.used_questions for insert to anon, authenticated with check (true);

grant select on public.hall_of_fame to anon, authenticated;
grant select, insert on public.used_questions to anon, authenticated;

create or replace function public.record_player_stats(
  p_name text,
  p_games integer,
  p_wins integer,
  p_answered integer,
  p_correct integer,
  p_points integer,
  p_best_streak integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  clean_name text := trim(coalesce(p_name, ''));
  norm_name text := lower(trim(coalesce(p_name, '')));
begin
  if clean_name = '' then
    raise exception 'Nome do jogador vazio';
  end if;
  insert into public.hall_of_fame
    (player_name, normalized_name, games, wins, answered, correct, total_points, best_streak, updated_at)
  values
    (clean_name, norm_name, greatest(p_games,0), greatest(p_wins,0), greatest(p_answered,0),
     greatest(p_correct,0), greatest(p_points,0), greatest(p_best_streak,0), now())
  on conflict (normalized_name) do update set
    player_name = excluded.player_name,
    games = public.hall_of_fame.games + excluded.games,
    wins = public.hall_of_fame.wins + excluded.wins,
    answered = public.hall_of_fame.answered + excluded.answered,
    correct = public.hall_of_fame.correct + excluded.correct,
    total_points = public.hall_of_fame.total_points + excluded.total_points,
    best_streak = greatest(public.hall_of_fame.best_streak, excluded.best_streak),
    updated_at = now();
end;
$$;

revoke all on function public.record_player_stats(text,integer,integer,integer,integer,integer,integer) from public;
grant execute on function public.record_player_stats(text,integer,integer,integer,integer,integer,integer) to anon, authenticated;
