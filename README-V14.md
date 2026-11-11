# Show do Jorjão — V14 (ajustes de roster e leitura estratégica)

Esta versão parte da V13 e mantém a arquitetura do jogo, o banco de perguntas, a pontuação, o Duelo Dourado e a integração Supabase.

## Ajustes
- A tela de seleção agora só exibe como predefinidos os sete nomes oficiais: PH, MATHEUS, JORJÃO, CHARRA, GUSTAVO, YGOR e VINICIUS. Registros extras marcados incorretamente como oficiais no banco (por exemplo, Carlos) deixam de aparecer na lista fixa. O registro não é apagado do banco nem do Hall da Fama.
- Novo modo opcional **Leitura estratégica · 5 segundos**: mostra a pergunta primeiro, inicia uma contagem regressiva de cinco segundos e só então libera as alternativas.
- O cronômetro de resposta usado pelo modo de pontuação começa quando as alternativas são liberadas, não durante o tempo de leitura.
- A opção **Alternativas imediatas** mantém o comportamento anterior como padrão.
- A contagem é cancelada se o jogador voltar para a tela de passagem do dispositivo.

## Configuração
A configuração Supabase permanece em `cloud-config.js`. Use a Project URL e a Publishable key já configuradas no seu projeto. Nunca use `service_role` no navegador.

## Validação
- `node --check app.js`: aprovado.
- `node --check questions.js`: aprovado.
- `node --check cloud-config.js`: aprovado.
- Revisão estática dos filtros de jogadores oficiais, temporizador de leitura e início do cronômetro de resposta.
- Não foi realizado teste E2E real com Supabase nesta entrega. Antes de publicar, testar os dois modos de leitura, os dois formatos de partida, convidados, Hall da Fama e Duelo Dourado.
