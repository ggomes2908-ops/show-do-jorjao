(() => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const screens = ['home','pass','question','reveal','duel','results'];
  const state = {players:[],themes:[],rounds:10,questions:[],round:0,playerIndex:0,answers:[],scores:{},history:[],questionShownAt:0,roundPoints:{},lastResults:[],duelPlayers:[],duelQuestion:null,duelIndex:0,duelAnswers:[],duelUsed:[],duelWinner:null,displayedAnswers:[],duelDisplayedAnswers:[]};
  const HISTORY_KEY='quizDaFirma.usedQuestions.v1';
  let toastTimer;
  function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2600)}
  function show(name){screens.forEach(s=>$('#screen-'+s).classList.toggle('active',s===name));window.scrollTo({top:0,behavior:'smooth'})}
  function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function shuffle(items){const out=[...items];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
  function playerRows(){return $$('#players .player-row')}
  function syncPlayerUI(){const rows=playerRows();$('#player-count').textContent=rows.length+' jogador'+(rows.length===1?'':'es');$('#add-player').disabled=rows.length>=10;rows.forEach((r,i)=>{r.querySelector('.player-number').textContent=String(i+1).padStart(2,'0');r.querySelector('input').setAttribute('aria-label','Nome do jogador '+(i+1));r.querySelector('.remove-player').disabled=rows.length<=2})}
  function addPlayer(name=''){if(playerRows().length>=10)return;const row=document.createElement('div');row.className='player-row';row.innerHTML='<span class="player-number"></span><input maxlength="20" placeholder="Nome ou apelido" aria-label="Nome do jogador"><button class="remove-player" title="Remover jogador" aria-label="Remover jogador">×</button>';row.querySelector('input').value=name;$('#players').appendChild(row);syncPlayerUI();row.querySelector('input').focus()}
  $('#add-player').addEventListener('click',()=>addPlayer());
  $('#players').addEventListener('click',e=>{if(e.target.matches('.remove-player')){e.target.closest('.player-row').remove();syncPlayerUI()}});
  $('#players').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('input')){e.preventDefault();const rows=playerRows();const i=rows.indexOf(e.target.closest('.player-row'));if(rows[i+1])rows[i+1].querySelector('input').focus();else if(rows.length<10)addPlayer()}});
  syncPlayerUI();
  $('#themes').addEventListener('change',e=>{if(e.target.matches('input[type=checkbox]'))e.target.closest('.theme-card').classList.toggle('selected',e.target.checked);const all=$$('#themes input');$('#toggle-themes').textContent=all.every(x=>x.checked)?'Desmarcar todos':'Selecionar todos'});
  $('#toggle-themes').addEventListener('click',()=>{const all=$$('#themes input'),allChecked=all.every(x=>x.checked);all.forEach(x=>{x.checked=!allChecked;x.closest('.theme-card').classList.toggle('selected',!allChecked)});$('#toggle-themes').textContent=allChecked?'Selecionar todos':'Desmarcar todos'});
  function setRounds(n){state.rounds=Math.max(1,Math.min(20,n));$('#round-value').textContent=state.rounds}
  $('#round-minus').addEventListener('click',()=>setRounds(state.rounds-1));$('#round-plus').addEventListener('click',()=>setRounds(state.rounds+1));
  function getUsed(){try{return JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]')}catch{return []}}
  function saveUsed(ids){try{const all=[...new Set([...getUsed(),...ids])];localStorage.setItem(HISTORY_KEY,JSON.stringify(all.slice(-1000)))}catch{}}
  function chooseQuestions(themes,count){const bank=window.QUIZ_QUESTIONS.filter(q=>themes.includes(q.category) && q.difficulty==='genio');if(bank.length<count)return null;const used=new Set(getUsed());let fresh=bank.filter(q=>!used.has(q.id));if(fresh.length<count){/* When the selected pool is exhausted, reset only that pool rather than repeat inside a match. */fresh=bank.slice();toast('O banco de perguntas deste tema foi reiniciado para permitir uma nova partida.')}for(let i=fresh.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[fresh[i],fresh[j]]=[fresh[j],fresh[i]]}return fresh.slice(0,count)}
  $('#start-game').addEventListener('click',()=>{const names=playerRows().map(r=>r.querySelector('input').value.trim());if(names.some(n=>!n)){toast('Preencha o nome de todos os participantes.');return}if(new Set(names.map(n=>n.toLocaleLowerCase('pt-BR'))).size!==names.length){toast('Use nomes ou apelidos diferentes para cada jogador.');return}const themes=$$('#themes input:checked').map(x=>x.value);if(!themes.length){toast('Selecione pelo menos um tema.');return}const questions=chooseQuestions(themes,state.rounds);if(!questions){toast('Ainda não há perguntas suficientes para essa combinação. Selecione mais temas ou reduza as rodadas.');return}state.players=names;state.themes=themes;state.questions=questions;state.round=0;state.playerIndex=0;state.scores=Object.fromEntries(names.map(n=>[n,0]));state.history=[];state.roundPoints={};state.lastResults=[];state.duelWinner=null;saveUsed(questions.map(q=>q.id));prepareRound();show('pass')});
  function currentQ(){return state.questions[state.round]}
  function prepareRound(){state.playerIndex=0;state.answers=[];state.roundPoints={};$('#round-label').textContent=`RODADA ${state.round+1} DE ${state.rounds}`;$('#question-round').textContent=`RODADA ${state.round+1} DE ${state.rounds}`;$('#progress-bar').style.width=((state.round+1)/state.rounds*100)+'%';updatePassScreen()}
  function updatePassScreen(){const name=state.players[state.playerIndex];$('#active-player-name').textContent=name;$('#score-mini').textContent=state.answers.length+' / '+state.players.length+' respostas';$('#turn-list').innerHTML=state.players.map((p,i)=>`<span class="turn-chip ${i<state.playerIndex?'done':''}">${i<state.playerIndex?'✓ ':''}${escapeHTML(p)}</span>`).join('');$('#show-question').textContent='Estou pronto para responder →';}
  $('#show-question').addEventListener('click',()=>{const q=currentQ();$('#question-number').textContent=String(state.round+1).padStart(2,'0')+' / '+String(state.rounds).padStart(2,'0');$('#question-category').textContent=q.category;$('#question-text').textContent=q.q;$('#answer-feedback').textContent='';$('#answers').innerHTML='';state.displayedAnswers=shuffle(q.a.map((text,originalIndex)=>({text,originalIndex})));state.displayedAnswers.forEach((item,i)=>{const b=document.createElement('button');b.className='answer-option';b.innerHTML=`<span class="answer-letter">${'ABCD'[i]}</span><span>${escapeHTML(item.text)}</span>`;b.addEventListener('click',()=>submitAnswer(item.originalIndex));$('#answers').appendChild(b)});state.questionShownAt=performance.now();show('question')});
  function submitAnswer(choice){if(state.answers.some(a=>a.player===state.players[state.playerIndex]))return;const elapsed=(performance.now()-state.questionShownAt)/1000;const q=currentQ(),correct=choice===q.correct;const bonus=0;const points=correct?1:0;state.answers.push({player:state.players[state.playerIndex],choice,correct,elapsed,bonus,points});state.roundPoints[state.players[state.playerIndex]]=points;$$('#answers .answer-option').forEach(b=>{b.disabled=true});$('#answer-feedback').textContent='Resposta registrada! Passe o dispositivo ao próximo participante.';setTimeout(()=>{state.playerIndex++;if(state.playerIndex<state.players.length){updatePassScreen();show('pass')}else showReveal()},850)}
  $('#back-to-pass').addEventListener('click',()=>{updatePassScreen();show('pass')});
  function showReveal(){const q=currentQ();$('#reveal-category').textContent=q.category;$('#reveal-question-text').textContent=q.q;$('#reveal-correct').textContent='✓ '+q.a[q.correct]+' — '+q.explanation;const ordered=state.players.map(p=>state.answers.find(a=>a.player===p)).sort((a,b)=>b.points-a.points||a.elapsed-b.elapsed);state.lastResults=ordered;ordered.forEach(a=>state.scores[a.player]+=a.points);state.history.push({question:q,answers:ordered});$('#round-results').innerHTML=ordered.map(a=>`<div class="result-row ${a.correct?'':'missed'}"><span class="result-avatar">${escapeHTML(a.player.slice(0,1).toLocaleUpperCase('pt-BR'))}</span><span class="result-name">${escapeHTML(a.player)}</span><span class="result-detail">${a.correct?'Acertou':'Errou'}</span><span class="result-points">+${a.points}</span></div>`).join('');const ranking=rankedPlayers();$('#mini-leaderboard').innerHTML=ranking.slice(0,4).map((p,i)=>`<span class="mini-score">${i+1}º <b>${escapeHTML(p.name)}</b> · ${p.score} pts</span>`).join('');$('#next-round').innerHTML=state.round===state.rounds-1?'Ver resultado final <span>→</span>':'Próxima rodada <span>→</span>';show('reveal')}
  function rankedPlayers(){return state.players.map(name=>({name,score:state.scores[name],correct:state.history.reduce((n,h)=>n+(h.answers.find(a=>a.player===name)?.correct?1:0),0)})).sort((a,b)=>b.score-a.score||b.correct-a.correct||a.name.localeCompare(b.name,'pt-BR'))}
  $('#next-round').addEventListener('click',()=>{if(state.round>=state.rounds-1){renderFinal();if(!$('#screen-duel').classList.contains('active'))show('results')}else{state.round++;prepareRound();show('pass')}});
  function renderFinal(){let ranking=rankedPlayers();const tied=ranking.filter(p=>p.score===ranking[0]?.score);if(tied.length>1&&!state.duelWinner){startDuel(tied.map(p=>p.name));return}if(state.duelWinner){ranking.sort((a,b)=>(a.name===state.duelWinner?-1:b.name===state.duelWinner?1:0)||(b.score-a.score)||b.correct-a.correct||a.name.localeCompare(b.name,'pt-BR'))}const winner=state.duelWinner?ranking.find(p=>p.name===state.duelWinner):ranking[0];$('#winner-announcement').textContent=winner?'O grande vencedor é '+winner.name+'!':'Partida concluída!';$('#winner-announcement').hidden=!state.duelWinner;$('#jorjao-line').textContent=state.duelWinner?'Lembrei agora!':'Calma, não esqueci o resultado não!';$('#jorjao-placeholder').classList.remove('sad-reveal','winner-reveal');$('#jorjao-photo').src=state.duelWinner?'jorjao-lembrou.png':'jorjao-esqueceu.png';$('#jorjao-photo').alt=state.duelWinner?'Jorjão anunciando o campeão':'Jorjão pensando no resultado';$('#reveal-winner').hidden=!!state.duelWinner;$('#final-subtitle').textContent=`${state.rounds} rodadas concluídas · ${state.players.length} participantes`;const podium=$('#podium');const places=[ranking[1],ranking[0],ranking[2]],medals=['🥈','🥇','🥉'];podium.innerHTML=places.map((p,i)=>p?`<div class="podium-place ${i===1?'first':''}"><div class="podium-medal">${medals[i]}</div><div class="podium-name">${escapeHTML(p.name)}</div><div class="podium-points">${p.score}</div><div class="podium-label">PONTOS</div></div>`:'').join('');$('#final-ranking').innerHTML=ranking.map((p,i)=>`<div class="ranking-row"><span class="rank-number">${String(i+1).padStart(2,'0')}</span><div><div class="rank-name">${escapeHTML(p.name)} ${i===0?'👑':''}</div><div class="rank-stats">${p.correct} acerto${p.correct===1?'':'s'} de ${state.rounds}</div></div><span class="rank-points">${p.score}</span><span class="rank-unit">PTS</span></div>`).join('');$('.final-table .count-chip').textContent=state.rounds+' rodadas'}

  function startDuel(names){
    state.duelPlayers=[...names];state.duelUsed=state.questions.map(q=>q.id);state.duelWinner=null;
    $('#duel-intro').textContent=names.length===2?'A pontuação empatou! O título será decidido no confronto final.':'A pontuação empatou entre '+names.length+' participantes! O título será decidido no confronto final.';
    $('#duel-finalists').innerHTML=names.map((n,i)=>`<span class="duel-finalist"><b>${i+1}</b>${escapeHTML(n)}</span>`).join('');
    $('#duel-stage').innerHTML='<button id="duel-start" class="btn btn-primary">Começar confronto final →</button>';
    $('#duel-start').addEventListener('click',startDuelQuestion);show('duel');
  }
  function startDuelQuestion(){
    const pool=window.QUIZ_QUESTIONS.filter(q=>q.difficulty==='genio'&&!state.duelUsed.includes(q.id));
    if(!pool.length){toast('O banco de desempate acabou; vamos reutilizar perguntas do banco.');state.duelUsed=[];return startDuelQuestion()}
    const q=pool[Math.floor(Math.random()*pool.length)];state.duelUsed.push(q.id);state.duelQuestion=q;state.duelIndex=0;state.duelAnswers=[];
    renderDuelTurn();
  }
  function renderDuelTurn(){
    const q=state.duelQuestion, name=state.duelPlayers[state.duelIndex];
    $('#duel-stage').innerHTML=`<div class="duel-round-label">PERGUNTA DE DESEMPATE · FINALISTA ${state.duelIndex+1} DE ${state.duelPlayers.length}</div><div class="duel-active">Vez de <strong>${escapeHTML(name)}</strong></div><p class="duel-question">${escapeHTML(q.q)}</p><div class="duel-answers" id="duel-answers"></div><p class="duel-feedback" id="duel-feedback">Passe o dispositivo apenas para ${escapeHTML(name)}.</p>`;
    state.duelDisplayedAnswers=shuffle(q.a.map((text,originalIndex)=>({text,originalIndex})));state.duelDisplayedAnswers.forEach((item,i)=>{const b=document.createElement('button');b.className='answer-option';b.innerHTML=`<span class="answer-letter">${'ABCD'[i]}</span><span>${escapeHTML(item.text)}</span>`;b.addEventListener('click',()=>submitDuelAnswer(item.originalIndex));$('#duel-answers').appendChild(b)});
  }
  function submitDuelAnswer(choice){
    const q=state.duelQuestion;state.duelAnswers.push({player:state.duelPlayers[state.duelIndex],choice,correct:choice===q.correct});
    if(state.duelIndex<state.duelPlayers.length-1){state.duelIndex++;renderDuelTurn();return}
    showDuelOutcome();
  }
  function showDuelOutcome(){
    const q=state.duelQuestion;
    const correct=state.duelAnswers.filter(a=>a.correct);
    const wrong=state.duelAnswers.filter(a=>!a.correct);
    const answerBlock=`<div class="correct-answer">✓ Resposta correta: ${escapeHTML(q.a[q.correct])}<br><small>${escapeHTML(q.explanation||'')}</small></div>`;
    const rows=state.duelAnswers.map(a=>`<div class="result-row ${a.correct?'':'missed'}"><span class="result-name">${escapeHTML(a.player)}</span><span class="result-detail">${a.correct?'✓ Continua no duelo':'✕ Eliminado'}</span></div>`).join('');
    let message='', button='';
    if(correct.length===1){
      state.duelWinner=correct[0].player;
      message=`<h2 class="duel-outcome-title">🏆 ${escapeHTML(state.duelWinner)} vence o Duelo Dourado!</h2><p class="duel-feedback">Acertou sozinho e é o campeão do Show do Jorjão!</p>`;
      button='<button id="duel-finish" class="btn btn-primary">Ver campeão no pódio →</button>';
    } else if(correct.length===0){
      message='<h2 class="duel-outcome-title">Ninguém acertou!</h2><p class="duel-feedback">Ninguém será eliminado nesta rodada. Todos os finalistas continuam para uma nova pergunta.</p>';
      button='<button id="duel-next" class="btn btn-primary">Nova pergunta para todos →</button>';
    } else {
      state.duelPlayers=correct.map(a=>a.player);
      message=`<h2 class="duel-outcome-title">${correct.length} finalistas continuam!</h2><p class="duel-feedback">${wrong.length} participante${wrong.length===1?' foi':'s foram'} eliminado${wrong.length===1?'':'s'}. A próxima pergunta será apenas para quem acertou.</p>`;
      button='<button id="duel-next" class="btn btn-primary">Continuar o duelo →</button>';
    }
    $('#duel-stage').innerHTML=`${message}${answerBlock}<div class="round-results">${rows}</div>${button}`;
    if(state.duelWinner) $('#duel-finish').addEventListener('click',()=>{renderFinal();show('results')});
    else $('#duel-next').addEventListener('click',startDuelQuestion);
  }
  function resetToHome(){show('home')}
  $('#reveal-winner').addEventListener('click',()=>{const box=$('#jorjao-placeholder');box.classList.remove('sad-reveal');box.classList.add('winner-reveal');$('#jorjao-photo').src='jorjao-lembrou.png';$('#jorjao-photo').alt='Jorjão levantando o dedo ao lembrar o resultado';$('#jorjao-line').textContent='Lembrei agora!';$('#winner-announcement').hidden=false;$('#reveal-winner').hidden=true;});$('#play-again').addEventListener('click',()=>{$('#start-game').click()});$('#new-game').addEventListener('click',resetToHome);$('#quit-game').addEventListener('click',()=>{if(confirm('Sair da partida? O progresso atual será perdido.'))resetToHome()});
})();
