# Show do Jorjão — Desafio do Almoço

Primeiro protótipo estático do quiz para GitHub Pages, em português. Feito com HTML, CSS e JavaScript puro, sem build ou dependências de runtime.

## O que funciona nesta versão
- Cadastro de 2 a 10 jogadores em um computador compartilhado.
- Seleção de 7 temas e configuração de 1 a 20 rodadas.
- Banco inicial com perguntas de nível avançado/genial, com explicação da resposta. O jogo seleciona questões marcadas como `genio`.
- Passagem de vez: a pergunta é exibida apenas quando o jogador ativo confirma que está pronto.
- Revelação da resposta e pontos somente depois de todos responderem à pergunta.
- 1 ponto por acerto e zero por erro. Sem bônus de velocidade e sem cronômetro eliminatório.
- Ranking final, número de acertos e opção de revanche.
- Histórico local das perguntas usadas para reduzir repetições entre partidas neste navegador.
- Layout responsivo para computador e celular.

## Limitações importantes do MVP
- Esta versão é local e não cria salas sincronizadas entre dispositivos. O modo de uso selecionado é um único computador compartilhado.
- A memória de perguntas usadas fica no `localStorage` do navegador, não em um banco compartilhado. Limpar os dados do navegador apaga esse histórico.
- O banco de perguntas é inicial e estático. As perguntas difíceis do banco inicial são estáticas. “Geopolítica e atualidades” não é um feed ao vivo: atualização automática exige uma API/fontes e backend com validação editorial.
- O bônus usa o tempo entre exibir a pergunta e a escolha de cada pessoa. Não há limite de tempo nem penalidade por demora.

## Publicar no GitHub Pages
1. Crie um repositório no GitHub, por exemplo `quiz-da-firma`.
2. Envie `index.html`, `style.css`, `app.js`, `questions.js` e `README.md` para a raiz do repositório.
3. Abra **Settings → Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**, selecione `main` e `/ (root)`, e salve.
5. Aguarde o GitHub publicar o site. A URL aparecerá em Settings → Pages.

## Próxima etapa para salas reais e atualidades
Para códigos de sala, sincronização multi-dispositivo, controle confiável de respostas e histórico partilhado, integrar um backend como Supabase Realtime (Postgres + Realtime + políticas de acesso). Para notícias recentes, criar uma rotina de servidor/Edge Function que recolha de fontes confiáveis, gere perguntas com fonte e data, valide respostas e grave-as no banco. Não colocar chaves secretas no JavaScript público do GitHub Pages.

## Final com frase do Jorjão
A tela final inclui a brincadeira “Calma, não esqueci o resultado não!” e o botão “Lembrei agora!” para revelar o nome do vencedor. Para a animação usar a foto triste real do Jorjão, substitua o espaço reservado pela imagem fornecida pelo usuário quando disponível.


Atualização: o botão da animação final agora diz “Toque para o Jorjão Lembrar o Resultado”.


## Versão 4
- Tela inicial mais chamativa, com a logo ampliada como imagem de fundo e visual de programa de quiz.
- Identidade azul e dourada reforçada, com chamada de desafio nível gênio.
- Mantém o banco de perguntas e o histórico local para reduzir repetições.

### Atualização de perguntas e atualidades
O histórico local evita repetir perguntas já utilizadas neste navegador, desde que haja perguntas novas disponíveis no banco. Isso não equivale a atualização automática de notícias. Para publicar perguntas atuais de geopolítica/notícias de forma confiável, a próxima integração deve usar uma fonte de notícias e um backend/API que gere e valide perguntas, registrando IDs e datas; não é seguro colocar chaves privadas diretamente no GitHub Pages.
