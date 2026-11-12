-- Show do Jorjão V17 — conquistas permanentes por categoria
-- Execute este arquivo uma única vez no Supabase SQL Editor.

create table if not exists public.player_achievements (
  player_id uuid not null references public.players(id) on delete cascade,
  category text not null,
  tier text not null check (tier in ('bronze','silver','gold')),
  unlocked_at timestamptz not null default now(),
  primary key (player_id, category, tier)
);

alter table public.player_achievements enable row level security;
drop policy if exists "Leitura pública de insígnias" on public.player_achievements;
create policy "Leitura pública de insígnias"
on public.player_achievements for select to anon, authenticated using (true);
grant select on public.player_achievements to anon, authenticated;

-- Mantém a soma do histórico por categoria e registra os níveis alcançados.
-- ON CONFLICT DO NOTHING garante que uma insígnia desbloqueada nunca seja perdida.
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
declare
  v_answered integer;
  v_correct integer;
  v_accuracy numeric;
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

  select answered, correct into v_answered, v_correct
  from public.player_category_stats
  where player_id = p_player_id and category = trim(p_category);

  v_accuracy := case when v_answered > 0 then (v_correct::numeric / v_answered::numeric) * 100 else 0 end;

  if v_answered >= 10 and v_accuracy >= 70 then
    insert into public.player_achievements(player_id, category, tier)
    values (p_player_id, trim(p_category), 'bronze') on conflict do nothing;
  end if;
  if v_answered >= 20 and v_accuracy >= 80 then
    insert into public.player_achievements(player_id, category, tier)
    values (p_player_id, trim(p_category), 'silver') on conflict do nothing;
  end if;
  if v_answered >= 30 and v_accuracy >= 90 then
    insert into public.player_achievements(player_id, category, tier)
    values (p_player_id, trim(p_category), 'gold') on conflict do nothing;
  end if;
end;
$$;

revoke all on function public.record_player_category_stats(uuid,text,integer,integer,integer,numeric) from public;
grant execute on function public.record_player_category_stats(uuid,text,integer,integer,integer,numeric) to anon, authenticated;

-- Retroativo: concede insígnias para jogadores que já atingiram os critérios
-- nas estatísticas de categoria existentes antes desta atualização.
insert into public.player_achievements(player_id, category, tier)
select player_id, category, 'bronze'
from public.player_category_stats
where answered >= 10 and (correct::numeric / nullif(answered,0)) >= 0.70
on conflict do nothing;

insert into public.player_achievements(player_id, category, tier)
select player_id, category, 'silver'
from public.player_category_stats
where answered >= 20 and (correct::numeric / nullif(answered,0)) >= 0.80
on conflict do nothing;

insert into public.player_achievements(player_id, category, tier)
select player_id, category, 'gold'
from public.player_category_stats
where answered >= 30 and (correct::numeric / nullif(answered,0)) >= 0.90
on conflict do nothing;
