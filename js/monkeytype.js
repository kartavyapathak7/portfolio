(function () {
  'use strict';

  const username = SITE_CONFIG.monkeytypeUsername || 'kartavya40';
  const widget = document.getElementById('monkeytypeWidget');
  if (!widget) return;

  const TIME_MODES = ['15', '30', '60', '120'];
  const WORD_MODES = ['10', '25', '50', '100'];
  const SAMPLE_WORDS = ['the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog', 'type', 'fast', 'code', 'ship', 'build', 'python', 'automate', 'deploy', 'monkey', 'keyboard', 'speed', 'accuracy'];

  let profileData = null;
  let activeMode = 'time';
  let activeLen = '15';
  let wordIndex = 0;
  let typingTimer = null;

  function formatDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  }

  function formatPb(entry) {
    if (!entry || !entry.length) return null;
    const best = entry[0];
    return {
      wpm: Math.round(best.wpm),
      acc: best.acc.toFixed(1),
      consistency: best.consistency.toFixed(1),
    };
  }

  function getBestWpm(data) {
    let best = 0;
    const pbs = data?.personalBests;
    if (!pbs) return best;
    ['time', 'words'].forEach((mode) => {
      if (!pbs[mode]) return;
      Object.values(pbs[mode]).forEach((entries) => {
        if (entries?.[0]?.wpm > best) best = entries[0].wpm;
      });
    });
    return Math.round(best);
  }

  function getPbForLen(mode, len) {
    return formatPb(profileData?.personalBests?.[mode]?.[len]);
  }

  function updateLengthButtons() {
    const lengthsEl = document.getElementById('mtLengths');
    if (!lengthsEl) return;
    const lengths = activeMode === 'time' ? TIME_MODES : WORD_MODES;
    if (!lengths.includes(activeLen)) activeLen = lengths[0];

    lengthsEl.innerHTML = lengths.map((len) =>
      `<button type="button" class="mt-len${len === activeLen ? ' active' : ''}" data-len="${len}">${len}</button>`
    ).join('');

    lengthsEl.querySelectorAll('.mt-len').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeLen = btn.dataset.len;
        lengthsEl.querySelectorAll('.mt-len').forEach((b) => b.classList.toggle('active', b === btn));
        updateHighlightPb();
        renderPbGrid();
      });
    });
  }

  function updateHighlightPb() {
    const pb = getPbForLen(activeMode, activeLen);
    const wpmEl = document.getElementById('mtPbWpm');
    const liveWpm = document.getElementById('mtLiveWpm');
    const liveAcc = document.getElementById('mtLiveAcc');

    if (pb) {
      if (wpmEl) wpmEl.textContent = pb.wpm;
      if (liveWpm) liveWpm.textContent = pb.wpm;
      if (liveAcc) liveAcc.textContent = pb.acc;
    } else {
      if (wpmEl) wpmEl.textContent = '—';
      if (liveWpm) liveWpm.textContent = '—';
      if (liveAcc) liveAcc.textContent = '—';
    }
  }

  function renderPbGrid() {
    const grid = widget.querySelector('.mt-pb-grid');
    const lengths = activeMode === 'time' ? TIME_MODES : WORD_MODES;
    const pbs = profileData?.personalBests?.[activeMode] || {};
    const unit = activeMode === 'time' ? 's' : 'w';

    grid.innerHTML = lengths.map((len) => {
      const pb = formatPb(pbs[len]);
      const isActive = len === activeLen;
      if (!pb) {
        return `<button type="button" class="mt-pb-cell mt-pb-empty${isActive ? ' active' : ''}" data-len="${len}">
          <span class="mt-pb-cell-len">${len}${unit}</span><span class="mt-pb-cell-val">—</span>
        </button>`;
      }
      return `<button type="button" class="mt-pb-cell${isActive ? ' active' : ''}" data-len="${len}">
        <span class="mt-pb-cell-len">${len}${unit}</span>
        <span class="mt-pb-cell-val">${pb.wpm}</span>
      </button>`;
    }).join('');

    grid.querySelectorAll('.mt-pb-cell').forEach((cell) => {
      cell.addEventListener('click', () => {
        activeLen = cell.dataset.len;
        document.getElementById('mtLengths')?.querySelectorAll('.mt-len').forEach((b) => {
          b.classList.toggle('active', b.dataset.len === activeLen);
        });
        grid.querySelectorAll('.mt-pb-cell').forEach((c) => c.classList.toggle('active', c === cell));
        updateHighlightPb();
      });
    });
  }

  function renderWords() {
    const wordsEl = document.getElementById('mtWords');
    if (!wordsEl) return;

    const slice = [];
    for (let i = 0; i < 12; i++) {
      slice.push(SAMPLE_WORDS[(wordIndex + i) % SAMPLE_WORDS.length]);
    }

    wordsEl.innerHTML = slice.map((w, i) => {
      let cls = 'mt-word';
      if (i < 3) cls += ' correct';
      else if (i === 3) cls += ' active';
      else if (i === 4) cls += ' extra';
      return `<span class="${cls}">${w}</span>`;
    }).join('');
  }

  function startWordAnimation() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      renderWords();
      return;
    }
    renderWords();
    typingTimer = setInterval(() => {
      wordIndex = (wordIndex + 1) % SAMPLE_WORDS.length;
      renderWords();
    }, 900);
  }

  function syncGlobalWpm(bestWpm) {
    ['mtBestWpm'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = bestWpm;
    });

    const heroStat = document.getElementById('heroWpmStat');
    if (heroStat) {
      heroStat.dataset.count = bestWpm;
      heroStat.textContent = bestWpm;
    }
  }

  function renderWidget(data) {
    profileData = data;
    const stats = data.typingStats || {};
    const bestWpm = getBestWpm(data);

    widget.querySelector('.mt-username').textContent = data.name || username;
    widget.querySelector('.mt-tests').textContent = (stats.completedTests || 0).toLocaleString();
    widget.querySelector('.mt-time').textContent = formatDuration(stats.timeTyping || 0);
    widget.querySelector('.mt-streak').textContent = data.streak ?? '—';
    widget.querySelector('.mt-xp').textContent = (data.xp || 0).toLocaleString();

    syncGlobalWpm(bestWpm);
    updateLengthButtons();
    updateHighlightPb();
    renderPbGrid();
    startWordAnimation();

    widget.classList.remove('mt-loading', 'mt-error');
    widget.classList.add('mt-loaded');
  }

  function renderError() {
    widget.classList.remove('mt-loading');
    widget.classList.add('mt-error');
    const grid = widget.querySelector('.mt-pb-grid');
    if (grid) {
      grid.innerHTML = `<p class="mt-error-msg">Couldn't load live stats. <a href="${SITE_CONFIG.monkeytype}" target="_blank" rel="noopener noreferrer">View on Monkeytype →</a></p>`;
    }
    startWordAnimation();
  }

  widget.querySelectorAll('.mt-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      activeMode = tab.dataset.mode;
      widget.querySelectorAll('.mt-tab').forEach((t) => t.classList.toggle('active', t === tab));
      updateLengthButtons();
      updateHighlightPb();
      renderPbGrid();
    });
  });

  fetch(`https://api.monkeytype.com/users/${encodeURIComponent(username)}/profile`)
    .then((res) => {
      if (!res.ok) throw new Error('Profile not found');
      return res.json();
    })
    .then((json) => {
      if (!json.data) throw new Error('No data');
      renderWidget(json.data);
    })
    .catch(renderError);
})();
