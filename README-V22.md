# Show do Jorjão — V22 (candidato de validação)

## O que mudou

### Estabilidade da partida e da roleta
- O resultado da rodada é idempotente: a mesma rodada não soma pontos duas vezes.
- A tela de resultado normaliza a participação de todos os jogadores, evitando lacunas quando um participante é dispensado ou não possui registro.
- O efeito **NÃO JOGA** registra explicitamente a participação como pulada, sem pontuação, penalidade ou contagem como resposta.
- Estatísticas gerais e por categoria ignoram participações puladas.
- A tela de resultados mostra claramente “Não jogou · sem penalidade”.
- O estado da pergunta exibida é limpo ao iniciar uma nova rodada.
- Há bloqueios temporários contra duplo clique no avanço da vez e na transição de rodada.
- As demais regras da roleta e os modos de jogo foram preservados no código-base.

### Banco de perguntas
- Mantidas 1.040 perguntas, 13 categorias e 80 perguntas por categoria.
- As alternativas das 240 questões de Futebol, Biologia e Arquitetura e Engenharia foram reconstruídas com distratores do mesmo tipo de resposta ou subárea.
- Foram corrigidas alternativas de 42 questões antigas sinalizadas pela auditoria por extensão/contexto.
- Uma questão duplicada de Química foi substituída por uma questão sobre substituição nucleofílica acílica.
- O banco foi validado quanto a IDs únicos, enunciados únicos, quatro alternativas, gabaritos válidos e explicações preenchidas.

## Status de validação — leia antes de publicar

- A revisão editorial humana/factual integral de todas as 1.040 questões ainda não foi concluída. O candidato contém edições direcionadas em 283 questões; as outras 757 não receberam revisão editorial completa nesta etapa.
- Os distratores reconstruídos foram selecionados a partir de respostas corretas do mesmo tipo/subárea; isso melhora a coerência temática, mas ainda exige revisão humana para garantir que cada distrator seja inequívoco e não possa ser correto em uma interpretação alternativa.
- O teste automatizado de navegador foi tentado por `file://` e por servidor HTTP local, mas Chromium bloqueou ambas as navegações com `ERR_BLOCKED_BY_ADMINISTRATOR`. Portanto, não há aprovação E2E.
- O Supabase real não foi testado porque o pacote recebido mantém a configuração pública como placeholder. Configure `cloud-config.js` com a URL e a chave pública do seu projeto antes de testar recursos online.

## Como testar localmente

1. Faça backup da V21.
2. Extraia a pasta completa `show-do-jorjao-v22`.
3. Abra a pasta no VS Code.
4. Configure `cloud-config.js` com as credenciais públicas do Supabase, se for testar ranking, perfis e reserva global de perguntas.
5. Inicie com Live Server ou outro servidor HTTP local; não abra `index.html` diretamente pelo explorador de arquivos.
6. Teste partidas curtas nos formatos compartilhado e individual, com 2 e 3 participantes.
7. Teste a roleta, inclusive **NÃO JOGA**, **TROCA**, **COROA**, **PEDÁGIO**, **IMPOSTO**, **+5**, **-5** e **NADA ACONTECE**.
8. Verifique ranking, histórico e estatísticas após uma partida com participante dispensado.

## Arquivos

- `index.html`: interface e seleção de categorias/modos.
- `app.js`: regras, fluxo de partida, roleta, resultados e persistência.
- `questions.js`: banco de perguntas V22.
- `style.css` e imagens: identidade visual e componentes existentes.

**Status:** candidato técnico com testes estruturais aprovados; não é uma versão final certificada. Não substituir a versão publicada sem concluir os testes de navegador, Supabase e a revisão editorial pendente.
