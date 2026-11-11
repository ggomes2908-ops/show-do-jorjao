-- SHOW DO JORJÃO V12 — migração complementar
-- Execute no SQL Editor do Supabase antes de publicar a V12.

-- Reserva atômica: todas as perguntas são reservadas ou nenhuma é.
create or replace function public.claim_questions(p_question_ids text[])
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_count integer;
  inserted_count integer := 0;
  qid text;
begin
  if p_question_ids is null or cardinality(p_question_ids) = 0 then
    raise exception 'Nenhuma pergunta informada';
  end if;

  requested_count := cardinality(p_question_ids);

  for qid in select distinct unnest(p_question_ids)
  loop
    insert into public.used_questions(question_id)
    values (qid)
    on conflict (question_id) do nothing;

    if not found then
      raise exception 'Uma ou mais perguntas já foram utilizadas';
    end if;

    inserted_count := inserted_count + 1;
  end loop;

  if inserted_count <> requested_count then
    raise exception 'A lista contém IDs duplicados';
  end if;

  return true;
end;
$$;

revoke all on function public.claim_questions(text[]) from public;
grant execute on function public.claim_questions(text[]) to anon, authenticated;

-- Evita que convidado use o mesmo nome normalizado de um perfil oficial.
create or replace function public.register_guest(p_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  clean_name text;
  normalized text;
  player_uuid uuid;
begin
  clean_name := trim(coalesce(p_name, ''));
  normalized := lower(clean_name);

  if length(clean_name) < 2 or length(clean_name) > 30 then
    raise exception 'O nome deve ter entre 2 e 30 caracteres';
  end if;

  if exists (
    select 1 from public.players
    where normalized_name = normalized and is_official = true
  ) then
    raise exception 'Esse nome pertence a um jogador oficial';
  end if;

  insert into public.players(display_name, normalized_name, is_official)
  values(clean_name, normalized, false)
  on conflict (normalized_name)
  do update set display_name = excluded.display_name
  returning id into player_uuid;

  insert into public.player_stats(player_id)
  values(player_uuid)
  on conflict (player_id) do nothing;

  return player_uuid;
end;
$$;

revoke all on function public.register_guest(text) from public;
grant execute on function public.register_guest(text) to anon, authenticated;
