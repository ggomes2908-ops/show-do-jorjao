# Show do Jorjão — V16 Perfis oficiais

## O que entrou nesta versão
- Nomes dos jogadores oficiais no Hall da Fama agora abrem um perfil detalhado.
- Foto de perfil compartilhada entre dispositivos via Supabase Storage.
- Envio de imagem pela galeria, processamento para WebP quadrado (recorte central automático) e substituição da foto existente.
- Estatísticas exibidas: vitórias, partidas, pontos, aproveitamento, acertos/respostas e melhor sequência.
- Conquistas calculadas a partir das estatísticas já existentes.
- Aproveitamento por categoria, com acertos, total de respostas, pontos e tempo acumulado de resposta.
- As métricas por categoria são agregadas somente a partir das partidas concluídas após a instalação desta atualização.
- Convidados temporários continuam sem perfil permanente e fora do Hall da Fama.

## Instalação no Supabase
1. Abra o projeto `show-do-jorjao` no Supabase.
2. Entre em SQL Editor.
3. Abra e execute o arquivo atualizado `supabase-v16-perfis.sql`. Se você já executou a versão anterior deste script, execute novamente o arquivo completo: as instruções foram preparadas para poderem ser reaplicadas com segurança.
4. O script cria `players.avatar_url`, o bucket público `player-avatars` e as políticas de leitura/upload/substituição para os sete jogadores oficiais.
5. O mesmo script também cria `player_category_stats` e a função `record_player_category_stats` para registrar o desempenho por categoria.
6. Não altere nem compartilhe a Secret/service_role key. O jogo usa a Publishable key no `cloud-config.js`.

## Configuração local
Mantenha no `cloud-config.js` a Project URL e a Publishable key já utilizadas na V15.1. O ZIP de desenvolvimento não contém a chave real.

## Importante sobre a atualização de desempenho por categoria
- O jogo continua com a mesma seleção de perguntas, regras, pontuação, temporizadores e fluxo de telas.
- As respostas são agrupadas por categoria e enviadas somente depois que a partida termina.
- Se a gravação complementar de categorias falhar, as estatísticas principais do Hall da Fama continuam salvas normalmente.
- O aproveitamento começa a contar a partir das partidas disputadas com esta atualização; não é possível reconstruir categorias de partidas antigas a partir dos totais agregados.

## Testes recomendados
- Abrir o Hall da Fama e clicar em cada um dos sete nomes.
- Selecionar uma foto e salvar; atualizar a página e conferir se continua aparecendo.
- Abrir o jogo em outro dispositivo/navegador e conferir a mesma foto.
- Substituir a foto e confirmar que a nova aparece em ambos os dispositivos.
- Confirmar que Carlos/Jair (registros antigos não oficiais) e convidados temporários não aparecem no Hall.

## Limitações desta primeira etapa
A tabela atual do projeto armazena estatísticas agregadas, não o histórico de cada partida nem respostas agrupadas por categoria ou tempo de resposta. Por isso, a V16 mostra os dados que já existem e não inventa histórico/categorias/tempo médio. Para isso, será necessária uma etapa de persistência detalhada das partidas.
