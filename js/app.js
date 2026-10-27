/* Penny Wise – main app (no dependencies, works offline) */
(function () {
  'use strict';
  const MODULES = window.PW_MODULES;
  const STORE_KEY = 'pennywise-progress-v1';
  const main = document.getElementById('main');
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));

  /* ---------- Progress (localStorage) ---------- */
  function defaults() { return { coins: 0, name: '', modules: {} }; }
  function load() {
    try { const s = JSON.parse(localStorage.getItem(STORE_KEY)); return s && typeof s === 'object' ? Object.assign(defaults(), s) : defaults(); }
    catch (e) { return defaults(); }
  }
  let state = load();
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* storage may be blocked */ } updateCoins(); }
  function mod(id) { return state.modules[id] || (state.modules[id] = { activity: false, quizBest: null, bonus: false }); }
  function moduleDone(id) { const m = state.modules[id]; return !!(m && m.activity && m.quizBest !== null); }
  function allDone() { return MODULES.every(m => moduleDone(m.id)); }
  function addCoins(n, msg) { state.coins += n; save(); toast(`+${n} 🪙 ${msg || ''}`); }
  function completeActivity(id) { const m = mod(id); if (!m.activity) { m.activity = true; addCoins(10, 'Activity complete!'); } }
  function completeBonus(id) { const m = mod(id); if (!m.bonus) { m.bonus = true; addCoins(15, 'Bonus star earned! ⭐'); } }
  function updateCoins() { const el = document.getElementById('coin-count'); if (el) el.textContent = state.coins; }

  let toastTimer;
  function toast(text) {
    const t = document.getElementById('toast'); t.textContent = text; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
  }

  /* ---------- Helpers ---------- */
  function money(n) { return '$' + (Math.round(n * 100) % 100 === 0 ? Math.round(n).toLocaleString('en-US') : n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })); }
  function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function parseNum(v) { const n = parseFloat(String(v).replace(/[$,\s]/g, '')); return isNaN(n) ? null : n; }

  function pennySVG(mood) {
    const mouth = mood === 'wow' ? '<ellipse cx="50" cy="66" rx="7" ry="8" fill="#7a4b00"/>' : '<path d="M36 62 Q50 76 64 62" stroke="#7a4b00" stroke-width="4" fill="none" stroke-linecap="round"/>';
    return `<svg viewBox="0 0 100 100" aria-hidden="true" class="penny-bob"><circle cx="50" cy="50" r="44" fill="#f8d878" stroke="#d9a845" stroke-width="5"/><circle cx="50" cy="50" r="34" fill="none" stroke="#ecc25e" stroke-width="2" stroke-dasharray="4 4"/><circle cx="37" cy="44" r="5" fill="#5a3a00"/><circle cx="63" cy="44" r="5" fill="#5a3a00"/><circle cx="38.5" cy="42.5" r="1.6" fill="#fff"/><circle cx="64.5" cy="42.5" r="1.6" fill="#fff"/><circle cx="28" cy="57" r="5" fill="#f4b6a6" opacity=".8"/><circle cx="72" cy="57" r="5" fill="#f4b6a6" opacity=".8"/>${mouth}</svg>`;
  }
  function guide(text, big, mood) { return `<div class="guide${big ? ' big' : ''}">${pennySVG(mood)}<div class="bubble">${text}</div></div>`; }

  /* ---------- Router ---------- */
  function route() {
    const parts = (location.hash.replace(/^#\/?/, '') || '').split('/');
    window.scrollTo(0, 0);
    if (parts[0] === 'm' && MODULES.some(m => m.id === parts[1])) renderModule(parts[1], parts[2] || 'learn1');
    else if (parts[0] === 'parents') renderParents();
    else if (parts[0] === 'certificate') renderCertificate();
    else renderHome();
    main.focus({ preventScroll: true });
  }
  window.addEventListener('hashchange', route);

  /* ---------- Home ---------- */
  function renderHome() {
    document.title = 'Penny Wise – Money skills for kids (ages 10–13)';
    const done = MODULES.filter(m => moduleDone(m.id)).length;
    const stars = MODULES.filter(m => state.modules[m.id] && state.modules[m.id].bonus).length;
    const hello = state.name ? `Welcome back, <b>${esc(state.name)}</b>! ` : '';
    main.innerHTML = `
      <section class="hero">
        ${guide(`${hello}Hi, I’m <b>Penny</b>! 👋 I’ll help you become a money expert. Play the 5 missions, earn coins 🪙 and become a <b>Penny Wise Money Champion</b>!`, true)}
        <div style="flex:1;min-width:220px">
          <h1>Learn money skills, the fun way</h1>
          <p class="muted">5 short missions · about 10 minutes each · for ages 10–13</p>
          <div class="progress-bar" role="progressbar" aria-label="Missions completed" aria-valuemin="0" aria-valuemax="5" aria-valuenow="${done}"><span style="width:${done * 20}%"></span></div>
          <p><b>${done} of 5</b> missions done · ⭐ ${stars} bonus stars</p>
        </div>
      </section>
      <h2 style="margin-top:20px">Your missions</h2>
      <div class="module-grid">
        ${MODULES.map(m => {
          const s = state.modules[m.id] || {};
          return `<a class="module-card" href="#/m/${m.id}" style="--mc:${m.color}">
            <span class="m-emoji" aria-hidden="true">${m.emoji}</span>
            <span><h3>${m.num}. ${m.title}</h3><p>${m.blurb}</p>
            <span class="status"><span class="${s.activity ? 'done' : ''}">${s.activity ? '✓' : '○'} Play</span><span class="${s.quizBest != null ? 'done' : ''}">${s.quizBest != null ? '✓ Quiz ' + s.quizBest + '/3' : '○ Quiz'}</span><span class="star ${s.bonus ? 'done' : ''}">${s.bonus ? '⭐' : '☆'} Bonus</span></span></span>
          </a>`; }).join('')}
      </div>
      <div class="home-links" style="margin-top:16px">
        <a class="card module-card" href="#/certificate" style="--mc:#f8dfa0"><span class="m-emoji" aria-hidden="true">🏆</span><span><h3>Money Champion certificate</h3><p>${allDone() ? 'Ready! Get your certificate.' : 'Unlocks when all 5 missions are done.'}</p></span></a>
        <a class="card module-card" href="#/parents" style="--mc:#a9cdee"><span class="m-emoji" aria-hidden="true">👪</span><span><h3>For parents</h3><p>Discussion tips for each mission.</p></span></a>
      </div>`;
  }

  /* ---------- Module page ---------- */
  const STEPS = [
    { key: 'learn1', label: '📖 Learn 1' }, { key: 'learn2', label: '📖 Learn 2' },
    { key: 'play', label: '🎮 Play' }, { key: 'quiz', label: '❓ Quiz' }, { key: 'bonus', label: '⭐ Bonus' }
  ];
  function renderModule(id, step) {
    const m = MODULES.find(x => x.id === id);
    if (!STEPS.some(s => s.key === step)) step = 'learn1';
    const s = mod(id);
    const idx = STEPS.findIndex(x => x.key === step);
    document.title = `${m.title} – Penny Wise`;
    const doneFlags = { play: s.activity, quiz: s.quizBest !== null, bonus: s.bonus };
    main.innerHTML = `
      <div style="--mc:${m.color}">
        <p><a href="#/">← All missions</a></p>
        <div class="module-head"><span class="m-emoji" aria-hidden="true">${m.emoji}</span><div><span class="pill">Mission ${m.num} of 5</span><h1 style="margin:2px 0">${m.title}</h1></div></div>
        <nav aria-label="Mission steps"><ol class="steps">
          ${STEPS.map(x => `<li><a href="#/m/${id}/${x.key}" class="${doneFlags[x.key] ? 'done' : ''} ${x.key === 'bonus' ? 'bonus-tab' : ''}" ${x.key === step ? 'aria-current="step"' : ''}>${x.label}${x.key === 'bonus' ? ' <small>(optional)</small>' : ''}</a></li>`).join('')}
        </ol></nav>
        <section class="card" id="step-body"></section>
        <div class="nav-row">
          ${idx > 0 ? `<a class="btn secondary" href="#/m/${id}/${STEPS[idx - 1].key}">← Back</a>` : '<span></span>'}
          ${nextButton(m, idx)}
        </div>
      </div>`;
    const body = $('#step-body');
    if (step === 'learn1' || step === 'learn2') {
      const L = m.lessons[step === 'learn1' ? 0 : 1];
      body.innerHTML = `<div class="lesson-illus" aria-hidden="true">${L.illus}</div>${L.html}`;
    } else if (step === 'play') {
      body.innerHTML = `<h2>${m.activityTitle}</h2><div id="activity"></div>`;
      ACTIVITIES[id]($('#activity'), () => { completeActivity(id); refreshTabs(id); });
    } else if (step === 'quiz') {
      renderQuiz(m, body);
    } else if (step === 'bonus') {
      renderBonus(m, body);
    }
  }
  function nextButton(m, idx) {
    const i = MODULES.indexOf(m);
    if (idx < 3) return `<a class="btn" href="#/m/${m.id}/${STEPS[idx + 1].key}">Next →</a>`;
    if (idx === 3) return `<span class="row"><a class="btn gold" href="#/m/${m.id}/bonus">⭐ Try the bonus</a>${i < 4 ? `<a class="btn" href="#/m/${MODULES[i + 1].id}">Next mission →</a>` : `<a class="btn" href="#/certificate">🏆 Certificate</a>`}</span>`;
    return i < 4 ? `<a class="btn" href="#/m/${MODULES[i + 1].id}">Next mission →</a>` : `<a class="btn" href="#/certificate">🏆 Certificate</a>`;
  }
  function refreshTabs(id) {
    const s = mod(id);
    const map = { play: s.activity, quiz: s.quizBest !== null, bonus: s.bonus };
    $$('.steps a').forEach(a => { const k = a.getAttribute('href').split('/').pop(); if (map[k]) a.classList.add('done'); });
  }

  /* ---------- Quiz ---------- */
  function renderQuiz(m, body) {
    let answered = 0, score = 0;
    body.innerHTML = `<h2>Quick quiz: 3 questions</h2>${guide('Take your time. After each answer I’ll explain why. 🧠')}
      ${m.quiz.map((q, qi) => `<div class="question" data-q="${qi}"><h3 id="q-${m.id}-${qi}">${qi + 1}. ${q.q}</h3>
        <div class="options" role="group" aria-labelledby="q-${m.id}-${qi}">${q.options.map((o, oi) => `<button class="option" data-o="${oi}">${o}</button>`).join('')}</div>
        <div class="feedback" aria-live="polite"></div></div>`).join('')}
      <div id="quiz-result" aria-live="polite"></div>`;
    $$('.question', body).forEach(qEl => {
      const q = m.quiz[+qEl.dataset.q];
      $$('.option', qEl).forEach(btn => btn.addEventListener('click', () => {
        const pick = +btn.dataset.o, right = pick === q.answer;
        $$('.option', qEl).forEach(b => { b.disabled = true; if (+b.dataset.o === q.answer) b.classList.add('correct'); });
        if (!right) btn.classList.add('wrong');
        const fb = $('.feedback', qEl); fb.className = 'feedback ' + (right ? 'ok' : 'bad');
        fb.textContent = (right ? '✅ Correct! ' : '❌ Not quite. ') + q.explain;
        answered++; if (right) score++;
        if (answered === m.quiz.length) finishQuiz(m, score);
      }));
    });
  }
  function finishQuiz(m, score) {
    const s = mod(m.id); const prev = s.quizBest === null ? 0 : s.quizBest;
    if (s.quizBest === null || score > s.quizBest) { s.quizBest = score; const gain = (score - prev) * 5; save(); if (gain > 0) addCoins(gain, 'Quiz coins!'); }
    refreshTabs(m.id);
    const msg = score === 3 ? 'Perfect score! 🎉' : score === 2 ? 'Great job! 👍' : 'Good try! Read the explanations and try again any time.';
    $('#quiz-result').innerHTML = `<div class="feedback ok">You got <b>${score} / 3</b>. ${msg}</div>
      <div class="row" style="margin-top:10px"><button class="btn secondary small" id="retry-quiz">↺ Try the quiz again</button></div>
      ${moduleDone(m.id) ? '' : '<p class="muted">Finish the 🎮 Play step too to complete this mission.</p>'}`;
    $('#retry-quiz').addEventListener('click', () => renderQuiz(m, $('#step-body')));
  }

  /* ---------- Bonus ---------- */
  function renderBonus(m, body) {
    const b = m.bonus;
    body.innerHTML = `<div class="bonus-banner"><span class="pill bonus">⭐ OPTIONAL BONUS CHALLENGE</span><h2 style="margin-top:6px">${b.title}</h2><p style="margin:0">For extra-curious minds (great for ages 12–13). Totally optional: you can be a Money Champion without it!</p></div>
      ${b.intro ? `<p style="margin-top:12px">${b.intro}</p>` : ''}<div id="bonus-area"></div><div id="bonus-result" aria-live="polite"></div>`;
    const area = $('#bonus-area');
    const finish = () => { completeBonus(m.id); refreshTabs(m.id); $('#bonus-result').innerHTML = '<div class="feedback ok">⭐ Bonus complete! You are thinking like a real money pro.</div>'; };
    if (b.custom) { BONUS_CUSTOM[b.custom](area, finish); return; }
    if (b.questions) {
      area.innerHTML = b.questions.map((q, i) => `<div class="num-q" data-i="${i}"><label for="bq-${i}"><b>${i + 1}.</b> ${q.q}</label>
        <div class="row" style="margin-top:6px">${q.unit === '$' ? '<span aria-hidden="true"><b>$</b></span>' : ''}<input id="bq-${i}" inputmode="decimal" autocomplete="off" aria-describedby="bf-${i}">${q.unit !== '$' ? `<span>${q.unit}</span>` : ''}<button class="btn small">Check</button></div>
        <div class="feedback" id="bf-${i}" aria-live="polite"></div></div>`).join('');
      const solved = new Set();
      $$('.num-q', area).forEach(el => {
        const q = b.questions[+el.dataset.i]; const input = $('input', el); const fb = $('.feedback', el);
        const check = () => {
          const v = parseNum(input.value);
          if (v === null) { fb.className = 'feedback info'; fb.textContent = 'Type a number first.'; return; }
          if (Math.abs(v - q.answer) <= (q.tol || 0.01)) { fb.className = 'feedback ok'; fb.textContent = '✅ Yes! ' + q.explain; solved.add(el.dataset.i); if (solved.size === b.questions.length) finish(); }
          else { fb.className = 'feedback bad'; fb.textContent = '🤔 Not yet. Try again! Hint: work it out step by step on paper.'; if (!el.dataset.tries) { el.dataset.tries = 1; } else { fb.textContent = '💡 Here’s how: ' + q.explain + ' Type the answer to continue.'; } }
        };
        $('button', el).addEventListener('click', check);
        input.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
      });
    } else if (b.mc) {
      area.innerHTML = b.mc.map((q, qi) => `<div class="question" data-q="${qi}"><h3 id="bmq-${qi}">${qi + 1}. ${q.q}</h3><div class="options" role="group" aria-labelledby="bmq-${qi}">${q.options.map((o, oi) => `<button class="option" data-o="${oi}">${o}</button>`).join('')}</div><div class="feedback" aria-live="polite"></div></div>`).join('');
      const solved = new Set();
      $$('.question', area).forEach(qEl => {
        const q = b.mc[+qEl.dataset.q];
        $$('.option', qEl).forEach(btn => btn.addEventListener('click', () => {
          const fb = $('.feedback', qEl);
          if (+btn.dataset.o === q.answer) {
            $$('.option', qEl).forEach(x => x.disabled = true); btn.classList.add('correct');
            fb.className = 'feedback ok'; fb.textContent = '✅ ' + q.explain; solved.add(qEl.dataset.q);
            if (solved.size === b.mc.length) finish();
          } else { btn.classList.add('wrong'); btn.disabled = true; fb.className = 'feedback bad'; fb.textContent = '🤔 Not this one. Do the math and try another answer!'; }
        }));
      });
    }
  }

  const BONUS_CUSTOM = {
    campShop(area, finish) {
      const items = [
        { e: '🧴', n: 'Sunscreen', p: 6, need: true }, { e: '🚰', n: 'Water bottle', p: 5, need: true }, { e: '🔦', n: 'Flashlight', p: 7, need: true },
        { e: '📚', n: 'Comic book', p: 4, need: false }, { e: '🍭', n: 'Candy', p: 3, need: false }, { e: '✨', n: 'Glow sticks', p: 5, need: false }
      ];
      const BUDGET = 25;
      area.innerHTML = `<p>You’re going to summer camp with <b>${money(BUDGET)}</b>. Buy <b>every need</b> on the list, then add wants <b>only if the money lasts</b>. Total must be ${money(BUDGET)} or less.</p>
        <div class="shop-list">${items.map((it, i) => `<label><input type="checkbox" data-i="${i}"><span aria-hidden="true" style="font-size:1.5rem">${it.e}</span><span>${it.n}</span><span class="price">${money(it.p)}</span></label>`).join('')}</div>
        <p class="spread"><span>Total: <b id="camp-total">$0</b> of ${money(BUDGET)}</span><span>Left: <b id="camp-left">${money(BUDGET)}</b></span></p>
        <button class="btn" id="camp-check">Check my shopping</button><div class="feedback" id="camp-fb" aria-live="polite"></div>`;
      const boxes = $$('input', area);
      const total = () => boxes.reduce((t, b) => t + (b.checked ? items[+b.dataset.i].p : 0), 0);
      boxes.forEach(b => b.addEventListener('change', () => { const t = total(); $('#camp-total').textContent = money(t); $('#camp-left').textContent = money(BUDGET - t); $('#camp-left').style.color = t > BUDGET ? 'var(--red)' : ''; }));
      $('#camp-check').addEventListener('click', () => {
        const fb = $('#camp-fb'); const t = total();
        const missing = items.filter((it, i) => it.need && !boxes[i].checked).map(it => it.n);
        if (missing.length) { fb.className = 'feedback bad'; fb.textContent = `Oops, you forgot a need: ${missing.join(', ')}. Needs come first!`; return; }
        if (t > BUDGET) { fb.className = 'feedback bad'; fb.textContent = `That’s ${money(t)}, which is ${money(t - BUDGET)} over budget. Remove a want.`; return; }
        const left = BUDGET - t;
        fb.className = 'feedback ok';
        fb.textContent = `✅ Great plan! Needs cost $18, so you had $7 for wants. You spent ${money(t)}${left > 0 ? ` and still have ${money(left)} to save` : ''}.`;
        finish();
      });
    }
  };

  /* ---------- Activities ---------- */
  const ACTIVITIES = {
    /* 1. Needs vs wants sorting game (tap buttons or drag & drop) */
    needs(el, done) {
      const items = [
        { e: '💧', n: 'Drinking water', need: true, why: 'Your body needs water every day.' },
        { e: '🎮', n: 'New video game', need: false, why: 'Fun, but you can live without it.' },
        { e: '🧥', n: 'Winter coat', need: true, why: 'It keeps you warm and healthy in the cold.' },
        { e: '🍬', n: 'Bag of candy', need: false, why: 'A treat, not something you need.' },
        { e: '🪥', n: 'Toothbrush', need: true, why: 'Keeping teeth healthy is a need.' },
        { e: '🥦', n: 'Healthy dinner', need: true, why: 'Food gives you energy to grow.' },
        { e: '🤖', n: 'Toy robot', need: false, why: 'Cool, but it’s a want.' },
        { e: '📓', n: 'School notebook', need: true, why: 'You need it to learn at school.' },
        { e: '🎟️', n: 'Concert ticket', need: false, why: 'A great experience, but a want.' },
        { e: '💊', n: 'Medicine when sick', need: true, why: 'Health always comes first.' }
      ];
      let left = items.map((_, i) => i), correct = 0;
      el.innerHTML = `${guide('Tap <b>Need</b> or <b>Want</b> for each card. On a computer you can also <b>drag</b> cards into the boxes!')}
        <div class="sort-bins">
          <div class="bin need" data-bin="need" aria-label="Needs box"><h3>🏠 Needs</h3><div class="chips"></div></div>
          <div class="bin want" data-bin="want" aria-label="Wants box"><h3>🎈 Wants</h3><div class="chips"></div></div>
        </div>
        <p class="muted" id="sort-count" aria-live="polite">${items.length} cards to sort</p>
        <div class="feedback" id="sort-fb" aria-live="polite"></div>
        <div id="sort-items"></div>`;
      const list = $('#sort-items', el);
      function draw() {
        list.innerHTML = left.map(i => `<div class="sort-item" draggable="true" data-i="${i}"><span class="emoji" aria-hidden="true">${items[i].e}</span><span class="label">${items[i].n}</span>
          <span class="row"><button class="btn small need-btn" data-pick="need" aria-label="${items[i].n} is a need">Need</button><button class="btn small want-btn" data-pick="want" aria-label="${items[i].n} is a want">Want</button></span></div>`).join('');
        $$('.sort-item', list).forEach(card => {
          $$('button', card).forEach(b => b.addEventListener('click', () => sort(+card.dataset.i, b.dataset.pick)));
          card.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', card.dataset.i); card.classList.add('dragging'); });
          card.addEventListener('dragend', () => card.classList.remove('dragging'));
        });
        $('#sort-count', el).textContent = left.length ? `${left.length} card${left.length > 1 ? 's' : ''} left to sort` : 'All sorted!';
      }
      $$('.bin', el).forEach(bin => {
        bin.addEventListener('dragover', e => { e.preventDefault(); bin.classList.add('over'); });
        bin.addEventListener('dragleave', () => bin.classList.remove('over'));
        bin.addEventListener('drop', e => { e.preventDefault(); bin.classList.remove('over'); const i = parseInt(e.dataTransfer.getData('text/plain'), 10); if (!isNaN(i)) sort(i, bin.dataset.bin); });
      });
      function sort(i, pick) {
        if (!left.includes(i)) return;
        const it = items[i]; const right = (pick === 'need') === it.need;
        const fb = $('#sort-fb', el);
        if (right) {
          correct++; left = left.filter(x => x !== i);
          $(`.bin[data-bin="${pick}"] .chips`, el).insertAdjacentHTML('beforeend', `<span class="chip">${it.e} ${it.n}</span>`);
          fb.className = 'feedback ok'; fb.textContent = `✅ Yes! ${it.n} is a ${pick}. ${it.why}`;
        } else {
          fb.className = 'feedback bad'; fb.textContent = `🤔 Hmm, think again: ${it.n}… ${it.why}`;
        }
        draw();
        if (!left.length) { fb.className = 'feedback ok'; fb.textContent = '🎉 Amazing! You sorted every card. Remember: needs first, then plan for wants.'; done(); }
      }
      draw();
    },

    /* 2. Saving goals: piggy bank */
    saving(el, done) {
      const goals = [{ e: '🚲', n: 'Bike', p: 60 }, { e: '🎧', n: 'Headphones', p: 36 }, { e: '🎨', n: 'Art set', p: 24 }, { e: '🛹', n: 'Skateboard', p: 45 }];
      let g = 0, weekly = 10, saved = 0, week = 0;
      el.innerHTML = `${guide('Pick a goal, choose how much to save each week, then drop coins in the piggy bank!')}
        <h3>1. Pick your goal</h3><div class="goal-grid" role="group" aria-label="Saving goals">${goals.map((x, i) => `<button class="goal-option" data-g="${i}" aria-pressed="${i === 0}"><span class="emoji" aria-hidden="true">${x.e}</span>${x.n}<br><b>${money(x.p)}</b></button>`).join('')}</div>
        <h3 style="margin-top:14px">2. How much will you save each week?</h3>
        <div class="slider-row"><label for="weekly">Weekly savings <span id="weekly-val">$10</span></label><input type="range" id="weekly" min="1" max="20" step="1" value="10"></div>
        <div class="feedback info" id="plan" aria-live="polite"></div>
        <h3 style="margin-top:14px">3. Fill your piggy bank</h3>
        <div class="piggy-wrap">
          <svg viewBox="0 0 220 160" role="img" aria-labelledby="piggy-label">
            <title id="piggy-label">Piggy bank</title>
            <defs><clipPath id="pig-clip"><ellipse cx="110" cy="88" rx="78" ry="56"/></clipPath></defs>
            <ellipse cx="110" cy="88" rx="78" ry="56" fill="#fde2e8"/>
            <rect id="pig-fill" x="20" y="144" width="180" height="0" fill="#f8d878" clip-path="url(#pig-clip)"/>
            <ellipse cx="110" cy="88" rx="78" ry="56" fill="none" stroke="#e8a3b5" stroke-width="5"/>
            <rect x="92" y="28" width="36" height="6" rx="3" fill="#c97f93"/>
            <ellipse cx="186" cy="92" rx="16" ry="14" fill="#f6c6d2" stroke="#e8a3b5" stroke-width="4"/>
            <circle cx="182" cy="90" r="2.5" fill="#a85a6e"/><circle cx="191" cy="90" r="2.5" fill="#a85a6e"/>
            <circle cx="160" cy="70" r="4" fill="#5a3a3a"/>
            <path d="M150 40 l10 -14 l6 18 z" fill="#f6c6d2" stroke="#e8a3b5" stroke-width="3"/>
            <rect x="60" y="134" width="16" height="20" rx="5" fill="#f6c6d2" stroke="#e8a3b5" stroke-width="3"/>
            <rect x="140" y="134" width="16" height="20" rx="5" fill="#f6c6d2" stroke="#e8a3b5" stroke-width="3"/>
            <path d="M32 80 q-16 -6 -10 -18" stroke="#e8a3b5" stroke-width="4" fill="none" stroke-linecap="round"/>
            <text id="pig-text" x="105" y="98" text-anchor="middle" font-size="22" font-weight="700" fill="#5a3a3a">$0</text>
          </svg>
          <div class="progress-bar" style="width:min(320px,100%)" role="progressbar" aria-label="Savings progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span id="pig-bar" style="width:0"></span></div>
          <div class="week-dots" id="dots" aria-hidden="true"></div>
          <div class="row" style="justify-content:center"><button class="btn" id="add-week">🪙 Save week 1</button><button class="btn secondary small" id="reset-pig">↺ Start over</button></div>
          <div class="feedback" id="pig-fb" aria-live="polite"></div>
        </div>`;
      const weeksNeeded = () => Math.ceil(goals[g].p / weekly);
      function plan() {
        const goal = goals[g]; const w = weeksNeeded(); const exact = goal.p % weekly === 0;
        $('#weekly-val', el).textContent = money(weekly);
        $('#plan', el).innerHTML = `${money(goal.p)} ÷ ${money(weekly)} = ${exact ? `<b>${w} weeks</b>` : `${(goal.p / weekly).toFixed(1)} → round up to <b>${w} weeks</b>`} to buy the ${goal.n.toLowerCase()} ${goal.e}.` + (w > 12 ? ' That’s a long time. Can you save a bit more?' : w <= 4 ? ' Super fast!' : '');
        $('#dots', el).innerHTML = Array.from({ length: w }, (_, i) => `<span class="${i < week ? 'filled' : ''}">${i + 1}</span>`).join('');
      }
      function drawPig() {
        const goal = goals[g]; const pct = Math.min(1, saved / goal.p);
        const h = 112 * pct; const r = $('#pig-fill', el); r.setAttribute('y', 144 - h); r.setAttribute('height', h);
        $('#pig-text', el).textContent = money(saved);
        $('#pig-bar', el).style.width = (pct * 100) + '%';
        $('.piggy-wrap .progress-bar', el).setAttribute('aria-valuenow', Math.round(pct * 100));
        $('#add-week', el).textContent = saved >= goal.p ? '🎉 Goal reached!' : `🪙 Save week ${week + 1}`;
        $('#add-week', el).disabled = saved >= goal.p;
        plan();
      }
      function reset() { saved = 0; week = 0; $('#pig-fb', el).textContent = ''; $('#pig-fb', el).className = 'feedback'; drawPig(); }
      $$('.goal-option', el).forEach(b => b.addEventListener('click', () => { g = +b.dataset.g; $$('.goal-option', el).forEach(x => x.setAttribute('aria-pressed', x === b)); reset(); }));
      $('#weekly', el).addEventListener('input', e => { weekly = +e.target.value; reset(); });
      $('#reset-pig', el).addEventListener('click', reset);
      $('#add-week', el).addEventListener('click', () => {
        const goal = goals[g]; week++; saved += weekly; const fb = $('#pig-fb', el);
        if (saved >= goal.p) {
          const extra = saved - goal.p;
          fb.className = 'feedback ok'; fb.textContent = `🎉 Week ${week}: you saved ${money(saved)}! You can buy the ${goal.n.toLowerCase()}${extra ? ` and still have ${money(extra)} left over` : ''}.`;
          done();
        } else { fb.className = 'feedback info'; fb.textContent = `Week ${week}: ${money(saved)} saved. ${money(goal.p - saved)} to go!`; }
        drawPig();
      });
      drawPig();
    },

    /* 3. Budgeting jars */
    budget(el, done) {
      const TOTAL = 20; const jars = { save: 0, share: 0, spend: 0 };
      const info = { save: ['🐷', 'Save'], share: ['💜', 'Share'], spend: ['🛍️', 'Spend'] };
      el.innerHTML = `${guide('You got your <b>$20</b> weekly allowance! Use + and − to split it between the jars. Tip: fill the <b>Save</b> jar first!')}
        <p class="spread"><span class="left-badge" id="left" aria-live="polite">$20 left to place</span><button class="btn secondary small" id="suggest">💡 Show me an example</button></p>
        <div class="jars">${['save', 'share', 'spend'].map(k => `<div class="jar ${k}"><div class="jar-glass" aria-hidden="true"><div class="jar-fill" id="fill-${k}" style="height:0"></div><div class="jar-amt" id="amt-${k}">$0</div></div>
          <b>${info[k][0]} ${info[k][1]}</b><div class="stepper"><button data-k="${k}" data-d="-1" aria-label="Take $1 out of ${info[k][1]} jar">−</button><span class="sr-only" id="sr-${k}" aria-live="polite">$0</span><button data-k="${k}" data-d="1" aria-label="Put $1 in ${info[k][1]} jar">+</button></div></div>`).join('')}</div>
        <button class="btn" id="lock">✅ Check my budget</button>
        <div class="feedback" id="budget-fb" aria-live="polite"></div>`;
      const placed = () => jars.save + jars.share + jars.spend;
      function draw() {
        ['save', 'share', 'spend'].forEach(k => { $('#fill-' + k, el).style.height = (jars[k] / TOTAL * 100) + '%'; $('#amt-' + k, el).textContent = money(jars[k]); $('#sr-' + k, el).textContent = `${info[k][1]}: ${money(jars[k])}`; });
        const left = TOTAL - placed(); $('#left', el).textContent = left ? `${money(left)} left to place` : 'All $20 placed ✓';
      }
      $$('.stepper button', el).forEach(b => b.addEventListener('click', () => {
        const k = b.dataset.k, d = +b.dataset.d;
        if (d > 0 && placed() >= TOTAL) { toast('No dollars left! Take $1 out of another jar.'); return; }
        if (d < 0 && jars[k] === 0) return;
        jars[k] += d; $('#budget-fb', el).textContent = ''; $('#budget-fb', el).className = 'feedback'; draw();
      }));
      $('#suggest', el).addEventListener('click', () => { jars.save = 8; jars.share = 2; jars.spend = 10; draw(); const fb = $('#budget-fb', el); fb.className = 'feedback info'; fb.textContent = 'Example: Save $8 (40%), Share $2 (10%), Spend $10 (50%). Now try your own split!'; });
      $('#lock', el).addEventListener('click', () => {
        const fb = $('#budget-fb', el); const left = TOTAL - placed();
        if (left > 0) { fb.className = 'feedback bad'; fb.textContent = `You still have ${money(left)} to place. Every dollar needs a job!`; return; }
        if (jars.save < 2) { fb.className = 'feedback bad'; fb.textContent = `Remember “pay yourself first”: try to put at least $2 (10%) in the Save jar.`; return; }
        let msg = `✅ Nice budget! Save ${money(jars.save)} (${jars.save * 5}%), Share ${money(jars.share)} (${jars.share * 5}%), Spend ${money(jars.spend)} (${jars.spend * 5}%). `;
        if (jars.save >= 10) msg += 'Wow, you’re a super saver! ';
        else if (jars.save >= 5) msg += 'Great saving habit! ';
        else msg += 'Good start. Could you save a little more next week? ';
        if (jars.share > 0) msg += 'Sharing is kind. 💜 ';
        if (jars.spend === 0) msg += 'It’s OK to keep a little for fun too!';
        if (jars.save > 0) msg += ` Saving ${money(jars.save)} every week = ${money(jars.save * 52)} in a year!`;
        fb.className = 'feedback ok'; fb.textContent = msg; done();
      });
      draw();
    },

    /* 4. Compound interest lab (kid-scale: $10–$200, 1–10 years, 0–10%) */
    interest(el, done) {
      let P = 100, Y = 10, R = 5, mission = false;
      el.innerHTML = `${guide('Move the sliders and watch the lines. <b>Mission:</b> make your money at least <b>double</b> in 10 years or less! 🎯')}
        <div class="slider-row"><label for="amt">Starting amount <span id="amt-v"></span></label><input type="range" id="amt" min="10" max="200" step="10" value="100"></div>
        <div class="slider-row"><label for="yrs">Years <span id="yrs-v"></span></label><input type="range" id="yrs" min="1" max="10" step="1" value="10"></div>
        <div class="slider-row"><label for="rate">Interest rate per year <span id="rate-v"></span></label><input type="range" id="rate" min="0" max="10" step="0.5" value="5"></div>
        <div class="chart-box"><div id="chart"></div>
          <div class="legend"><span><i style="background:#3f7fc4"></i>With compound interest</span><span><i style="background:#c9a77a"></i>Without interest (piggy bank)</span></div></div>
        <div class="stats" aria-live="polite"><div class="stat"><small>Without interest</small><b id="s-no"></b></div><div class="stat"><small>With interest</small><b id="s-yes"></b></div><div class="stat"><small>Interest earned</small><b id="s-int"></b></div></div>
        <div class="feedback" id="int-fb" aria-live="polite"></div>
        <p class="muted" style="font-size:.85rem">Interest is added once a year (compounded yearly). Made-up example rates, not real offers.</p>
        <section class="walk" aria-labelledby="walk-title">
          <h3 id="walk-title">❄️ Year by year: interest on interest</h3>
          <p class="muted" style="margin-top:0">Uses your sliders above. Press <b>Next year</b> to watch the snowball grow.</p>
          <div class="walk-legend" aria-hidden="true"><span><i class="seg-base"></i>Your money</span><span><i class="seg-simple"></i>Interest on your money</span><span><i class="seg-ioi"></i>Interest on interest</span></div>
          <ol class="walk-rows" id="walk-rows"></ol>
          <div class="feedback info" id="walk-say" aria-live="polite"></div>
          <div class="row"><button class="btn small" id="walk-next">➡️ Next year</button><button class="btn secondary small" id="walk-play" aria-pressed="false">▶ Auto-play</button><button class="btn secondary small" id="walk-reset">↺ Restart</button></div>
        </section>`;
      const round2 = n => Math.round(n * 100) / 100;
      const cents = n => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      /* ----- Year-by-year walkthrough ----- */
      let shown = 0, timer = null;
      const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      function yearData(n) { // n = 1..Y
        const r = R / 100, start = P * Math.pow(1 + r, n - 1), interest = start * r, end = start + interest;
        return { start, interest, end, onMoney: P * r, ioi: interest - P * r };
      }
      function stopPlay() { if (timer) { clearInterval(timer); timer = null; } const b = $('#walk-play', el); b.textContent = '▶ Auto-play'; b.setAttribute('aria-pressed', 'false'); }
      function walkReset() { stopPlay(); shown = 0; $('#walk-rows', el).innerHTML = ''; walkUI(); $('#walk-say', el).textContent = R === 0 ? 'At 0% there is no interest, so nothing grows. Raise the rate to see the snowball!' : `Start: you put ${cents(P)} in the bank at ${R}% a year. Press Next year!`; }
      function walkUI() { const end = shown >= Y || R === 0; $('#walk-next', el).disabled = end; $('#walk-play', el).disabled = end; }
      function walkNext() {
        if (shown >= Y || R === 0) { stopPlay(); return; }
        shown++;
        const d = yearData(shown), maxV = P * Math.pow(1 + R / 100, Y);
        const pct = v => (v / maxV * 100).toFixed(2) + '%';
        const simpleSoFar = d.onMoney * shown, ioiSoFar = Math.max(0, d.end - P - simpleSoFar);
        const line = shown === 1
          ? `Year 1: ${cents(d.start)} earns ${cents(d.interest)} → ${cents(d.end)}.`
          : `Year ${shown}: ${cents(d.start)} earns ${cents(d.interest)} → ${cents(d.end)}. The extra ${cents(d.ioi)} is interest on your interest!`;
        const li = document.createElement('li');
        li.className = 'walk-row' + (reduceMotion ? '' : ' grow');
        li.innerHTML = `<div class="walk-text"><b>Year ${shown}</b> <span>${cents(d.start)} + <b>${cents(d.interest)}</b> = <b>${cents(d.end)}</b></span>${shown > 1 ? ` <span class="ioi-tag">+${cents(d.ioi)} interest on interest ✨</span>` : ''}</div>
          <div class="walk-bar" aria-hidden="true"><span class="seg-base" style="width:${pct(P)}"></span><span class="seg-simple" style="width:${pct(simpleSoFar)}"></span><span class="seg-ioi" style="width:${pct(ioiSoFar)}"></span></div>`;
        $('#walk-rows', el).appendChild(li);
        let say = line;
        if (shown === 1) say += ` That’s ${R}% of ${cents(P)}.`;
        if (shown === Y) say += ` 🎉 In total: ${cents(round2(d.end - P))} of interest, and ${cents(round2(ioiSoFar))} of it was interest on interest.`;
        $('#walk-say', el).textContent = say;
        walkUI();
        if (shown >= Y) stopPlay();
      }
      $('#walk-next', el).addEventListener('click', () => { stopPlay(); walkNext(); });
      $('#walk-reset', el).addEventListener('click', walkReset);
      $('#walk-play', el).addEventListener('click', () => {
        if (timer) { stopPlay(); return; }
        if (shown >= Y) walkReset();
        const b = $('#walk-play', el); b.textContent = '⏸ Pause'; b.setAttribute('aria-pressed', 'true');
        walkNext(); timer = setInterval(walkNext, reduceMotion ? 2500 : 1400);
      });
      /* ----- Chart + mission ----- */
      function draw() {
        $('#amt-v', el).textContent = money(P); $('#yrs-v', el).textContent = Y + (Y === 1 ? ' year' : ' years'); $('#rate-v', el).textContent = R + '%';
        const pts = Array.from({ length: Y + 1 }, (_, t) => P * Math.pow(1 + R / 100, t));
        const final = pts[Y];
        $('#chart', el).innerHTML = chartSVG(pts, P, Y);
        $('#s-no', el).textContent = money(P); $('#s-yes', el).textContent = money(round2(final)); $('#s-int', el).textContent = money(round2(final - P));
        const fb = $('#int-fb', el);
        if (final >= 2 * P - 0.005) {
          fb.className = 'feedback ok';
          fb.textContent = `🎯 Mission complete! At ${R}% for ${Y} years, ${money(P)} grows to ${money(round2(final))}: that’s more than double!`;
          if (!mission) { mission = true; done(); }
        } else if (R === 0) {
          fb.className = 'feedback info'; fb.textContent = 'With 0% interest, your money doesn’t grow. Try raising the rate!';
        } else {
          fb.className = 'feedback info'; fb.textContent = `Your money grew by ${Math.round((final / P - 1) * 100)}%. Not doubled yet. Hint: try 10 years and a rate above 7%!`;
        }
        walkReset();
      }
      $('#amt', el).addEventListener('input', e => { P = +e.target.value; draw(); });
      $('#yrs', el).addEventListener('input', e => { Y = +e.target.value; draw(); });
      $('#rate', el).addEventListener('input', e => { R = +e.target.value; draw(); });
      draw();
    },

    /* 5. Smart shopping & scams */
    shopping(el, done) {
      const deals = [
        { a: { e: '🧃', n: 'Juice', size: '1 liter', price: 2.00, unit: 2.00, u: 'per liter' }, b: { e: '🧃', n: 'Juice', size: '2 liters', price: 3.50, unit: 1.75, u: 'per liter' }, best: 'b', tip: 'Here the bigger bottle wins.' },
        { a: { e: '🥣', n: 'Cereal', size: '300 g', price: 3.00, unit: 1.00, u: 'per 100 g' }, b: { e: '🥣', n: 'Cereal', size: '750 g', price: 8.25, unit: 1.10, u: 'per 100 g' }, best: 'a', tip: 'Surprise! The big box costs more per gram.' }
      ];
      const msgs = [
        { from: 'Unknown pop-up', t: '🎉 CONGRATS! You won a FREE phone! Enter your parent’s card number to pay $1 shipping. Offer ends in 2 minutes!', scam: true, why: 'A prize you never entered, a card number and a countdown: three red flags!' },
        { from: 'School library', t: 'Reminder: your library book is due back on Friday.', scam: false, why: 'A normal reminder. It asks for no money and no passwords.' },
        { from: '“Game Support”', t: 'Get 10,000 FREE gems! Just type your username and password here.', scam: true, why: 'Real companies never ask for your password. Never share it!' },
        { from: 'Game shop', t: '💎 Gem bundle: 500 gems for $4.99. Tap to buy!', scam: false, why: 'Not a scam, but it costs REAL money. Always ask a grown-up before buying.', label: 'Real money! Ask first' },
        { from: 'Message from a “friend”', t: 'Hey, I’m in trouble. Can you send me a gift card code right now? Don’t tell anyone!', scam: true, why: 'Rushing + secrets + gift cards = classic scam. Check with a grown-up.' }
      ];
      let dealsDone = 0, msgsDone = 0;
      el.innerHTML = `${guide('Two missions: find the better deal using the <b>unit price</b>, then spot the 🚩 red flags!')}
        <h3>Part 1 · Deal detective</h3><p>Tap the better deal in each pair.</p>
        ${deals.map((d, i) => `<div class="deal" data-i="${i}" style="margin-bottom:12px"><div class="compare">${['a', 'b'].map(k => `<button class="product" data-k="${k}"><span class="emoji" aria-hidden="true">${d[k].e}</span>${d[k].n}, ${d[k].size}<br><span class="price">${money(d[k].price)}</span><span class="unit muted" style="display:block;font-size:.85rem"></span></button>`).join('')}</div><div class="feedback" aria-live="polite"></div></div>`).join('')}
        <h3 style="margin-top:16px">Part 2 · Scam spotter</h3><p>Is each message OK, or a red flag? 🚩</p>
        ${msgs.map((m, i) => `<div class="message" data-i="${i}"><div class="from">From: ${m.from}</div><p>${m.t}</p><div class="row"><button class="btn small" data-s="0">👍 Looks OK</button><button class="btn small want-btn" data-s="1">🚩 Red flag</button></div><div class="feedback" aria-live="polite"></div></div>`).join('')}
        <div class="feedback" id="shop-fb" aria-live="polite"></div>`;
      const check = () => { if (dealsDone === deals.length && msgsDone === msgs.length) { const fb = $('#shop-fb', el); fb.className = 'feedback ok'; fb.textContent = '🕵️ Great detective work! You compared unit prices and spotted the tricks.'; done(); } };
      $$('.deal', el).forEach(dEl => {
        const d = deals[+dEl.dataset.i]; let solved = false;
        $$('.product', dEl).forEach(btn => btn.addEventListener('click', () => {
          if (solved) return;
          const fb = $('.feedback', dEl);
          $$('.product', dEl).forEach(b => { const x = d[b.dataset.k]; $('.unit', b).textContent = `= ${money(x.unit)} ${x.u}`; });
          if (btn.dataset.k === d.best) {
            solved = true; btn.classList.add('correct'); dealsDone++;
            fb.className = 'feedback ok'; fb.textContent = `✅ Right! ${money(d[d.best].unit)} ${d[d.best].u} is cheaper. ${d.tip}`; check();
          } else { btn.classList.add('wrong'); fb.className = 'feedback bad'; fb.textContent = `🤔 Look at the unit prices now shown under each price, and try again.`; }
        }));
      });
      $$('.message', el).forEach(mEl => {
        const m = msgs[+mEl.dataset.i]; let solved = false;
        $$('button', mEl).forEach(btn => btn.addEventListener('click', () => {
          if (solved) return;
          const fb = $('.feedback', mEl); const saysScam = btn.dataset.s === '1';
          if (saysScam === m.scam) {
            solved = true; msgsDone++; mEl.classList.add('answered-ok'); $$('button', mEl).forEach(b => b.disabled = true);
            fb.className = 'feedback ok'; fb.textContent = '✅ ' + (m.label ? m.label + ': ' : '') + m.why; check();
          } else { fb.className = 'feedback bad'; fb.textContent = '🤔 Look again. ' + (m.scam ? 'Is anyone asking for secrets, money, or rushing you?' : 'Does this ask for passwords or rush you?'); }
        }));
      });
    }
  };

  /* SVG line chart: compound vs no interest */
  function chartSVG(pts, P, Y) {
    const W = 600, H = 340, L = 84, Rm = 20, T = 24, B = 52;
    const vMax = Math.max(...pts) * 1.05, rawStep = vMax / 4, mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(st => st >= rawStep && (st >= 1 ? true : false)) || 10 * mag;
    const ticksY = Math.ceil(vMax / step), maxV = step * ticksY;
    const x = t => L + (W - L - Rm) * (Y === 0 ? 0 : t / Y);
    const y = v => T + (H - T - B) * (1 - v / maxV);
    const grid = [];
    for (let i = 0; i <= ticksY; i++) { const v = maxV * i / ticksY; grid.push(`<line x1="${L}" x2="${W - Rm}" y1="${y(v)}" y2="${y(v)}" stroke="#ece6da"/><text x="${L - 8}" y="${y(v) + 4}" text-anchor="end" font-size="19" fill="#56606d">${money(Math.round(v))}</text>`); }
    const stepX = Y <= 10 ? 1 : Y <= 20 ? 2 : 5; const xt = [];
    for (let t = 0; t <= Y; t += stepX) xt.push(`<text x="${x(t)}" y="${H - B + 24}" text-anchor="middle" font-size="19" fill="#5b6675">${t}</text>`);
    const line = pts.map((v, t) => `${t ? 'L' : 'M'}${x(t).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
    const area = `${line} L${x(Y)},${y(0)} L${x(0)},${y(0)} Z`;
    const final = pts[Y];
    const label = `Line chart. Without interest, ${money(P)} stays ${money(P)}. With ${''}compound interest it grows to ${money(Math.round(final * 100) / 100)} after ${Y} years.`;
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
      ${grid.join('')}${xt.join('')}
      <text x="${(L + W - Rm) / 2}" y="${H - 4}" text-anchor="middle" font-size="18" fill="#56606d">Years</text>
      <path d="${area}" fill="#3f7fc4" opacity=".10"/>
      <line x1="${x(0)}" x2="${x(Y)}" y1="${y(P)}" y2="${y(P)}" stroke="#c9a77a" stroke-width="4" stroke-dasharray="8 6" stroke-linecap="round"/>
      <path d="${line}" fill="none" stroke="#3f7fc4" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
      ${pts.map((v, t) => (Y <= 15 || t % stepX === 0 || t === Y) ? `<circle cx="${x(t)}" cy="${y(v)}" r="5" fill="#3f7fc4"/>` : '').join('')}
      <text x="${Math.min(x(Y), W - Rm - 4)}" y="${Math.max(y(final) - 12, 20)}" text-anchor="end" font-size="21" font-weight="700" fill="#2c5f96">${money(Math.round(final * 100) / 100)}</text>
    </svg>`;
  }
  function niceMax(v) { const p = Math.pow(10, Math.floor(Math.log10(v))); for (const m of [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (m * p >= v) return m * p; return 10 * p; }

  /* ---------- Certificate ---------- */
  function renderCertificate() {
    document.title = 'Money Champion certificate – Penny Wise';
    const doneCount = MODULES.filter(m => moduleDone(m.id)).length;
    if (!allDone()) {
      main.innerHTML = `<p><a href="#/">← All missions</a></p><section class="card" style="text-align:center">
        ${guide(`You’ve finished <b>${doneCount} of 5</b> missions. Finish the 🎮 Play and ❓ Quiz steps in every mission to unlock your certificate!`, true)}
        <div class="badges" aria-label="Mission badges">${MODULES.map(m => `<span class="${moduleDone(m.id) ? '' : 'locked'}" title="${m.title}">${m.emoji}</span>`).join('')}</div>
        <div class="row" style="justify-content:center">${MODULES.filter(m => !moduleDone(m.id)).map(m => `<a class="btn secondary small" href="#/m/${m.id}">${m.emoji} ${m.title}</a>`).join('')}</div></section>`;
      return;
    }
    const stars = MODULES.filter(m => state.modules[m.id].bonus).length;
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    main.innerHTML = `<p class="no-print"><a href="#/">← All missions</a></p>
      <div class="card no-print"><label for="cname"><b>Your name for the certificate:</b></label><div class="row" style="margin-top:6px"><input id="cname" class="name-input" maxlength="40" value="${esc(state.name)}" placeholder="Type your first name"><button class="btn gold" id="print">🖨️ Print / Save as PDF</button></div></div>
      <section class="certificate" aria-label="Certificate">
        <div style="width:90px;margin:0 auto">${pennySVG()}</div>
        <p class="muted" style="letter-spacing:2px;text-transform:uppercase;margin:0">Certificate of achievement</p>
        <h1>🏆 Penny Wise Money Champion 🏆</h1>
        <p>This certifies that</p>
        <div class="cert-name" id="cert-name">${esc(state.name) || 'Money Champion'}</div>
        <p>has completed all 5 Penny Wise missions and knows how to tell needs from wants, set saving goals, make a budget, grow money with compound interest, and shop smart.</p>
        <div class="badges" aria-label="Mission badges">${MODULES.map(m => `<span title="${m.title}">${m.emoji}</span>`).join('')}</div>
        <p><b>🪙 ${state.coins} coins</b> · <b>⭐ ${stars} of 5 bonus stars</b>${stars === 5 ? ' · <b>Bonus Master!</b>' : ''}</p>
        <p class="muted">${date}</p>
      </section>`;
    const input = $('#cname');
    input.addEventListener('input', () => { state.name = input.value.trim().slice(0, 40); save(); $('#cert-name').textContent = state.name || 'Money Champion'; });
    $('#print').addEventListener('click', () => window.print());
  }

  /* ---------- Parents ---------- */
  function renderParents() {
    document.title = 'For parents – Penny Wise';
    const T = window.PW_PARENT_TIPS;
    main.innerHTML = `<p><a href="#/">← Home</a></p>
      <section class="parents">
        <h1>👪 For parents & teachers</h1>
        <div class="card">
          <p><b>Penny Wise</b> is a free, short course for children aged 10–13. Each of the 5 missions has a 2-screen lesson, a hands-on activity, a 3-question quiz with explanations, and an <b>optional Bonus Challenge</b> with harder math (percentages, multi-step problems, the Rule of 72) for older or more confident kids.</p>
          <p><b>Privacy:</b> no accounts, no ads, no tracking, no data sent anywhere. Progress (coins, badges, first name on the certificate) is stored only in this browser’s local storage. You can erase it below.</p>
        </div>
        <h2>How to use it</h2>
        <ul>
          <li>Do one mission at a time (about 10 minutes), ideally sitting next to your child for the first one.</li>
          <li>Ask your child to <b>explain the answer back to you</b>. Teaching is the best way to learn.</li>
          <li>Connect each mission to real life within a day or two: a shopping trip, an allowance, a bank statement.</li>
          <li>Younger kids (10–11) can skip the ⭐ bonus. Older kids (12–13) will enjoy the challenge.</li>
        </ul>
        <h2>Discussion tips by mission</h2>
        ${MODULES.map(m => `<details><summary>${m.emoji} ${m.num}. ${m.title}</summary><ul>${T[m.id].map(t => `<li>${t}</li>`).join('')}</ul></details>`).join('')}
        <h2>Good conversation starters</h2>
        <ul>
          <li>“What’s something you really wanted, and was it worth the money?”</li>
          <li>“If you had $100, how would you split it?”</li>
          <li>“How can you tell if an online offer is real?”</li>
          <li>“Why do you think banks pay interest on savings, and charge interest on loans?”</li>
        </ul>
        <div class="card"><h2 style="margin-top:0">Reset progress</h2><p>Clear all coins, badges and the saved name on this device.</p><button class="btn secondary" id="reset-all">🗑️ Reset all progress</button></div>
        <p class="muted">Educational content only, not financial advice. Prices, products and interest rates in the app are simplified, made-up examples.</p>
      </section>`;
    $('#reset-all').addEventListener('click', () => {
      if (confirm('Reset all Penny Wise progress on this device?')) { state = defaults(); save(); toast('Progress reset'); location.hash = '#/'; }
    });
  }

  updateCoins();
  route();
})();
