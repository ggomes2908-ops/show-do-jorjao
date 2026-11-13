# Show do Jorjão — V23

Jogo de perguntas para jogar presencialmente em um único computador, com participantes alternando o dispositivo.

## Recursos
- 13 categorias, 1.040 perguntas (80 por categoria), de 1 a 20 rodadas e até 10 jogadores.
- Modos clássico e bônus por velocidade; roleta de efeitos; Duelo Dourado de desempate.
- Hall da fama e histórico no `localStorage` do navegador; perfis, ranking e conquistas opcionais via Supabase.

## Como executar
Use um servidor HTTP local (Live Server do VS Code, por exemplo) ou publique a pasta no GitHub Pages. Não abra o `index.html` direto pelo explorador de arquivos.
Para usar ranking/perfis, preencha `cloud-config.js` com a URL e a chave **pública** (publishable) do seu projeto Supabase.

## Testes
```
node tests/v22-skip-regression.test.cjs
node tests/v23-question-bank.test.cjs
```

## Documentação
- `README-V23.md`: o que mudou nesta versão e o que ainda está pendente.
- `docs/V23-ALTERACOES-PERGUNTAS.json`: antes e depois de cada pergunta alterada, para revisão.
- `docs/historico/`: READMEs e relatórios de validação das versões anteriores.
