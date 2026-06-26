(function () {
  'use strict';

  const username = SITE_CONFIG.monkeytypeUsername || 'kartavya40';
  const widget = document.getElementById('monkeytypeWidget');
  if (!widget) return;

  const TIME_MODES = ['15', '30', '60', '120'];
  const WORD_MODES = ['10', '25', '50', '100'];
  let profileData = null;
  let activeMode = 'time';

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

  function renderPbGrid(mode) {
    const grid = widget.querySelector('.mt-pb-grid');
    const lengths = mode === 'time' ? TIME_MODES : WORD_MODES;
    const pbs = profileData?.personalBests?.[mode] || {};
    const unit = mode === 'time' ? 's' : ' words';

    grid.innerHTML = lengths.map((len) => {
      const pb = formatPb(pbs[len]);
      if (!pb) {
        return `
          <div class="mt-pb-card mt-pb-empty">
            <span class="mt-pb-mode">${len}${unit}</span>
            <span class="mt-pb-wpm">—</span>
            <span class="mt-pb-meta">No PB yet</span>
          </div>`;
      }
      return `
        <div class="mt-pb-card">
          <span class="mt-pb-mode">${len}${unit}</span>
          <span class="mt-pb-wpm">${pb.wpm}<small>wpm</small></span>
          <span class="mt-pb-meta">${pb.acc}% acc · ${pb.consistency}% con</span>
        </div>`;
    }).join('');
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

    const highlight = document.getElementById('mtBestWpm');
    if (highlight) highlight.textContent = bestWpm;

    const liveWpm = document.getElementById('liveWpm');
    if (liveWpm) liveWpm.textContent = bestWpm;

    const counter = document.querySelector('.typing-big[data-count]');
    if (counter) {
      counter.dataset.count = bestWpm;
      counter.textContent = bestWpm;
    }

    renderPbGrid(activeMode);
    widget.classList.remove('mt-loading', 'mt-error');
    widget.classList.add('mt-loaded');
  }

  function renderError() {
    widget.classList.remove('mt-loading');
    widget.classList.add('mt-error');
    widget.querySelector('.mt-pb-grid').innerHTML = `
      <p class="mt-error-msg">Couldn't load live stats. <a href="${SITE_CONFIG.monkeytype}" target="_blank" rel="noopener noreferrer">View profile on Monkeytype →</a></p>`;
  }

  widget.querySelectorAll('.mt-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      activeMode = tab.dataset.mode;
      widget.querySelectorAll('.mt-tab').forEach((t) => t.classList.toggle('active', t === tab));
      if (profileData) renderPbGrid(activeMode);
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
