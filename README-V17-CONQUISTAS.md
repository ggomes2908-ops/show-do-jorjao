# V17 — Conquistas e insígnias por categoria

## O que mudou
- Insígnias compactas no rodapé do perfil individual.
- Dez categorias com símbolos próprios.
- Bronze: **Entusiasta de [categoria]** — mínimo de 10 respostas e 70% de aproveitamento.
- Prata: **Estudioso de [categoria]** — mínimo de 20 respostas e 80% de aproveitamento.
- Ouro: mínimo de 30 respostas e 90% de aproveitamento, com título próprio por categoria.
- O perfil mostra o nível mais alto desbloqueado em cada categoria, junto ao aproveitamento e volume de respostas.
- O Supabase registra os níveis desbloqueados em `player_achievements`. Registros são permanentes: uma queda posterior no aproveitamento não remove uma insígnia.
- O SQL faz concessão retroativa para estatísticas por categoria já existentes.

## Títulos de Ouro
- Conhecimento geral: Polímata
- Ciência e tecnologia: Einstein
- Geopolítica e atualidades: Diplomata
- Brasil: Brasileiro Nato
- História e geografia: Historiador
- Política: Mestre em Política
- Química: Walter White
- Lógica e enigmas: Mestre dos Enigmas
- Economia e negócios: Magnata
- Matemática e raciocínio: Pitágoras

Os títulos podem ser alterados no objeto `CATEGORY_ACHIEVEMENTS`, no início de `app.js`.

## Atualização do Supabase — obrigatória
1. Abra o projeto `show-do-jorjao` no Supabase.
2. Entre em **SQL Editor** e crie uma nova consulta.
3. Abra e copie todo o conteúdo de `supabase-v17-conquistas.sql`.
4. Cole no SQL Editor e clique em **Run**.
5. Confirme que a consulta terminou sem erro.

A migração cria a tabela de insígnias, configura leitura pública, atualiza a RPC que soma o desempenho e concede automaticamente as conquistas. Não apaga estatísticas, jogadores ou partidas.

## Teste local
Abra `index.html` pelo navegador (ou use um servidor local). Acesse um perfil oficial. O bloco **Insígnias** fica na parte inferior do perfil. Jogadores sem histórico começam com as dez categorias bloqueadas e o progresso atual visível.

## Observação
A versão base é a V16.2, sem roleta. O jogo continua gravando normalmente no Supabase quando conectado. A sintaxe JavaScript foi verificada com `node --check`; ainda é necessário testar uma partida real conectada ao Supabase para validar a gravação no ambiente do usuário.
