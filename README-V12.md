# Show do Jorjão V12 — integração com Supabase

## O que foi preparado
- Seleção dos 7 perfis oficiais carregados do Supabase.
- Cadastro de convidados pelo RPC `register_guest`.
- Estatísticas vinculadas ao UUID permanente do jogador.
- Hall da Fama global lendo `players` + `player_stats`.
- Histórico de perguntas compartilhado entre dispositivos.
- Reserva atômica de perguntas via `claim_questions`, evitando que duas partidas simultâneas reservem a mesma pergunta.
- Sem reinício automático do banco de perguntas quando o conjunto selecionado se esgota.

## Antes de publicar
1. Abra `supabase-v12-migration.sql` no SQL Editor do Supabase e execute.
2. Abra `cloud-config.js`.
3. Substitua `COLE_AQUI_SUA_SB_PUBLISHABLE_KEY` pela sua chave `sb_publishable_...`.
4. Não use Secret key, service_role ou senha do banco.
5. Teste localmente antes de enviar ao GitHub Pages.

## Segurança e limitações
- O navegador usa a Publishable key; nunca inclua Secret key/service_role.
- Os RPCs de cadastro, pontuação e reserva são acessíveis ao papel anon porque o jogo ainda não possui login individual. Isso permite que qualquer pessoa tecnicamente habilitada a chamar a API envie estatísticas; o ranking é compartilhado, mas não é antifraude. Para proteção real, será necessário autenticar jogadores ou validar resultados num servidor confiável.
- Os convidados são identificados por nome normalizado; nomes iguais podem ser confundidos. Os 7 perfis oficiais têm UUIDs fixos e não dependem do texto digitado.
- A lista de perguntas usadas é global. Ao esgotar as perguntas disponíveis nos temas selecionados, será necessário selecionar outros temas. Não há reset automático.
- O pacote inclui a base original V11; as imagens e recursos existentes foram preservados.
