# V15 — Convidados temporários

## Comportamento
- Os sete jogadores oficiais continuam carregados do Supabase e mantêm histórico no Hall da Fama.
- Convidados recebem identificadores temporários gerados no navegador; não são cadastrados na tabela `players` do Supabase.
- Convidados permanecem disponíveis na partida/sessão atual enquanto a página estiver aberta. Ao fechar ou recarregar a página, a seleção é perdida.
- Convidados participam normalmente da pontuação e do resultado da partida, mas não geram perfil nem estatísticas permanentes no Hall da Fama.

## Alteração técnica
- O botão de adicionar convidado não chama mais `rpc/register_guest`.
- `saveCareer` grava estatísticas somente para IDs que pertencem à lista oficial carregada do Supabase.
- O banco Supabase não precisa de migração adicional para esta alteração.

## Validação
- `node --check app.js` executado com sucesso.
- A validação end-to-end ainda depende de executar o jogo no navegador com o projeto Supabase configurado.
