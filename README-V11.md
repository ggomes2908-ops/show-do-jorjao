# Show do Jorjão V11 — Hall da Fama global e perguntas sem repetição

## O que mudou
- Perguntas usadas não são mais liberadas automaticamente quando o conjunto selecionado acaba.
- O jogo combina histórico local com histórico global do Supabase.
- O Hall da Fama aparece na tela inicial e também no resultado final.
- As estatísticas são somadas no ranking online para todos os dispositivos.
- Se o banco de perguntas escolhido não tiver perguntas inéditas suficientes, o jogo avisa e pede mais temas ou menos rodadas, em vez de repetir.

## Configurar o ranking global (necessário para sincronizar dispositivos)
1. Crie um projeto gratuito no Supabase.
2. No painel do projeto, abra **SQL Editor**.
3. Copie todo o conteúdo de `supabase-setup.sql`, cole e execute.
4. Abra **Project Settings → API** (ou Connect) e copie:
   - Project URL
   - anon / publishable key (NUNCA a `service_role`).
5. Abra `cloud-config.js` e preencha:
   ```js
   window.SHOW_DO_JORJAO_CLOUD = {
     url: 'https://SEU-PROJETO.supabase.co',
     anonKey: 'SUA_CHAVE_PUBLICA'
   };
   ```
6. Salve o arquivo e publique a pasta no GitHub Pages.

## Observações
- Sem preencher `cloud-config.js`, o jogo continua funcionando localmente, mas o ranking não será compartilhado entre dispositivos.
- O ranking global é público e qualquer visitante do jogo pode consultar o Hall da Fama. O RPC permite registrar resultados enviados pelo jogo; como não há login, não é um ranking anti-fraude.
- O histórico global de perguntas usadas também é público e compartilhado. Quando todas as perguntas dos temas selecionados tiverem sido usadas, será necessário selecionar mais temas. O jogo não reinicia o banco automaticamente.
- Em caso de indisponibilidade da internet, o jogo tenta manter o histórico local; o Hall global pode não atualizar até que a conexão seja restaurada. Resultados locais continuam disponíveis neste navegador.
