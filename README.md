# Show do Jorjão — V6 Final para o almoço

## Banco de perguntas
- **Total: 202 perguntas**.
- 10 categorias, todas com pelo menos 20 perguntas disponíveis.
- Todas as perguntas estão marcadas como `genio` para serem elegíveis no jogo.
- Cada pergunta tem quatro alternativas, gabarito e explicação curta.
- O jogo continua com 2–10 participantes, modo de passar o dispositivo, sem temporizador e sem bônus por velocidade.
- O histórico local evita repetir perguntas já usadas no mesmo navegador até esgotar o conjunto selecionado; ao esgotar, o jogo reinicia o conjunto para permitir novas partidas.

## Distribuição
| Categoria | Perguntas |
|---|---:|
| Conhecimento geral | 20 |
| Geopolítica e atualidades | 21 |
| Brasil | 20 |
| Ciência e tecnologia | 21 |
| História e geografia | 20 |
| Política | 20 |
| Química | 20 |
| Lógica e enigmas | 20 |
| Economia e negócios | 20 |
| Matemática e raciocínio | 20 |
| **Total** | **202** |

## Como abrir
Extraia o ZIP e abra `index.html` no navegador. Não é necessário instalar nada nem ter internet para jogar localmente.

## Limitações importantes
- O banco é estático; perguntas de atualidades não se atualizam sozinhas e precisam de revisão periódica.
- O histórico é salvo apenas no navegador usado para jogar.
- A sintaxe JavaScript foi validada, e a estrutura do banco foi conferida. Ainda assim, esta entrega não equivale a um teste completo em todos os navegadores/dispositivos.

## Desempate — Duelo Dourado
Quando dois ou mais participantes terminam empatados na maior pontuação, Jorjão anuncia o confronto final usando a arte `duelo-dourado.png`. Todos os finalistas respondem à mesma pergunta, um por vez, sem cronômetro. Se exatamente um acertar, é declarado campeão. Se ninguém acertar, todos continuam; se mais de um acertar, apenas os que acertaram seguem para a próxima pergunta. As perguntas de desempate não repetem as perguntas usadas na partida até o conjunto disponível se esgotar.

## V6 Final — regras de eliminação do Duelo Dourado
- Ao fim das rodadas, se houver empate na maior pontuação, todos os participantes empatados entram no duelo.
- Cada finalista responde individualmente à mesma pergunta, sem cronômetro.
- Se pelo menos uma pessoa acertar, quem errar é eliminado.
- Se ninguém acertar, todos os finalistas restantes continuam.
- Se apenas uma pessoa acertar uma pergunta, ela é declarada campeã.
- Se mais de uma pessoa acertar, somente essas pessoas avançam para a próxima pergunta.
- As perguntas do duelo são sorteadas do banco de nível gênio e não repetem as perguntas da partida até o conjunto se esgotar.

## V6.1 — correções de estabilidade e justiça
- Corrigido o fluxo do fim da partida: a tela de resultados não sobrescreve mais a tela de confronto.
- Após o duelo, o campeão e a mensagem de vitória aparecem automaticamente, sem depender do botão de revelação do Jorjão.
- As alternativas são embaralhadas a cada exibição, tanto na partida quanto no duelo, mantendo o gabarito correto.
- Encurtadas 50 alternativas corretas que estavam muito mais longas que as demais, para reduzir pistas visuais de tamanho. A revisão editorial do banco pode ser continuada para equilibrar todos os enunciados e alternativas.
