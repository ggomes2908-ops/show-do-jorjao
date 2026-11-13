# Show do Jorjão — V23

## O que mudou em relação à V22

### Perguntas
- Reescritas as alternativas incorretas de 151 perguntas que tinham distratores fora de contexto (ex.: "Alpes Dináricos" como opção para "qual império…", estados como opção para "qual tratado…", itens de biologia e engenharia misturados entre si).
- Novos distratores são do mesmo tipo da resposta certa (império com império, artigo da Carta da ONU com artigo, órgão com órgão) e de tamanho parecido, para a resposta correta não se destacar por ser a única coerente ou a mais longa.
- Corrigidos erros de conteúdo: `v18_hg_01` (alternativa "Bizantino" repetia a resposta certa), `v18_qu_27` (5s também é orbital esférico), `v18_br_34` ("Banco Central" repetia a resposta), `v18_hg_02` (a monarquia caiu em 1792, não em 1789), `v18_ga_14` (enunciado confuso) e `eng011`.
- Antes e depois de cada alteração: `docs/V23-ALTERACOES-PERGUNTAS.json`.

### Sorteio
- O sorteio não coloca mais, na mesma partida, duas perguntas que cobrem o mesmo conceito (46 grupos encontrados, como as 4 versões de "Cromatografia"). O mesmo vale para o desempate.

### Código e arquivos
- Escape de HTML em `data-player-id` e nas conquistas do perfil.
- Imagens convertidas de PNG para WebP: de 16,6 MB para 1,2 MB.
- Novo `tests/v23-question-bank.test.cjs` (estrutura do banco, resposta certa desproporcional, 300 partidas simuladas sem conceito repetido).
- READMEs e relatórios antigos movidos para `docs/historico/`.

## Pendências (não resolvidas aqui)
- Revisão factual humana das 1.040 perguntas. As correções acima foram feitas por revisão minha e checagem automática, não por especialista.
- As 46 duplicatas continuam no banco e só são evitadas no sorteio. O ideal é trocar uma de cada grupo por uma pergunta nova, o que também recupera o total de 80 por categoria.
- Teste de navegador completo (roleta com os 8 efeitos, todos os modos) e teste real do Supabase: não executados.
- `cloud-config.js` ainda tem a chave como placeholder.
