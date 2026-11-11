# Show do Jorjão — V13 (refinamento visual)

Esta versão parte da V12 e prioriza uma camada de apresentação mais consistente, mantendo a estrutura de dados, perguntas, regras de pontuação e integração Supabase existentes.

## O que mudou
- Redesign da tela inicial, seleção de jogadores, convidados, categorias, modos e Hall da Fama.
- Ajustes responsivos para desktop, tablet e celular.
- Categorias e modos sem emojis decorativos; marcadores numéricos e tipografia mais consistentes.
- Jogadores oficiais podem ser selecionados e desmarcados pelo próprio botão, inclusive quando restarem apenas dois ou um participante selecionado. A validação de mínimo de dois jogadores continua no botão de iniciar.
- Botões de remoção da lista deixam de ficar bloqueados artificialmente com dois participantes.
- Hall da Fama com linhas mais informativas, destaques visuais para as primeiras posições e indicadores de conquistas.
- Proteção para não registrar duas vezes as estatísticas da mesma partida quando a tela final é renderizada novamente (ex.: fluxo do Duelo Dourado).

## Mantido da V12
- Banco de 400 perguntas e categorias existentes.
- Regras de pontuação, formatos de partida, rodadas e Duelo Dourado.
- IDs dos jogadores oficiais e convidados no Supabase.
- RPCs `register_guest`, `claim_questions` e `record_player_stats`.
- Reserva global de perguntas usadas.

## Configuração
A configuração de Supabase continua em `cloud-config.js`. Preencha a URL do projeto e a chave `sb_publishable_...` conforme as instruções da V12. Nunca coloque a chave `service_role` no front-end.

## Validação desta entrega
- `node --check app.js`: aprovado.
- `node --check questions.js`: aprovado.
- `node --check cloud-config.js`: aprovado.
- Revisão estática dos fluxos de seleção/desmarcação e proteção de gravação duplicada.
- Não foi possível concluir teste E2E real com Supabase nesta execução. Antes de publicar, testar seleção/desmarcação, mínimo de dois jogadores, convidado, início/fim de partida e atualização do Hall em dois navegadores.
