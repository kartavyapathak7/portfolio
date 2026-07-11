/* Shared calculator utilities */
(function () {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const yearEl = document.getElementById('year');
  const cursorGlow = document.getElementById('cursorGlow');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open);
    });
  }

  if (cursorGlow) {
    let glowRAF;
    document.addEventListener('mousemove', (e) => {
      cancelAnimationFrame(glowRAF);
      glowRAF = requestAnimationFrame(() => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
      });
    });
  }

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && typeof window.runCalculator === 'function') {
      window.runCalculator();
    }
  });
})();

function toKg(weight, unit) {
  return unit === 'lbs' ? weight / 2.20462 : weight;
}

function toCm(height, unit) {
  if (unit === 'ft') {
    const feet = Math.floor(height);
    const inches = (height - feet) * 12;
    return feet * 30.48 + inches * 2.54;
  }
  return height;
}

function calcBMR(age, gender, weightKg, heightCm) {
  if (gender === 'male') {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  }
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
}

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  heavy: 1.725,
  athlete: 1.9
};

function calcTDEE(bmr, activity) {
  return Math.round(bmr * (ACTIVITY_MULTIPLIERS[activity] || 1.55));
}

function setToggle(groupId, value, values) {
  const btns = document.querySelectorAll(`#${groupId} .toggle-btn`);
  btns.forEach((btn, i) => {
    btn.classList.toggle('active', values[i] === value);
  });
}

function setUnit(groupId, value) {
  const btns = document.querySelectorAll(`#${groupId} .unit-btn`);
  btns.forEach(btn => {
    btn.classList.toggle('active', btn.textContent.trim() === value);
  });
}

function showResults() {
  document.getElementById('resultEmpty').style.display = 'none';
  const card = document.getElementById('resultCard');
  card.style.display = 'flex';
  setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 300);
}

function resetResults() {
  document.getElementById('resultCard').style.display = 'none';
  document.getElementById('resultEmpty').style.display = 'flex';
}

function renderSummary(text) {
  const el = document.getElementById('summaryText');
  if (el) el.textContent = text;
}

function renderResultRows(rows) {
  const container = document.getElementById('resultRows');
  if (!container) return;
  container.innerHTML = rows.map(r =>
    `<div class="result-row"><span>${r.label}</span><strong>${r.value}</strong></div>`
  ).join('');
}

function animateValue(el, end, duration = 800) {
  const start = 0;
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * (end - start) + start);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = end;
  };
  requestAnimationFrame(step);
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('active');
  setTimeout(() => toast.classList.remove('active'), 2500);
}

function copyReport(text) {
  navigator.clipboard.writeText(text).then(() => showToast('Results copied to clipboard!'));
}

function downloadReport(filename, text) {
  const blob = new Blob([text], { type: 'text/plain' });
  const anchor = document.createElement('a');
  anchor.download = filename;
  anchor.href = URL.createObjectURL(blob);
  anchor.click();
  URL.revokeObjectURL(anchor.href);
  showToast('File downloaded!');
}

function calcProteinTarget(weightKg, goal, activity, preference) {
  let multiplier = 1.6;
  if (preference === 'minimum') multiplier = 0.8;
  else if (preference === 'high') multiplier = 2.2;
  else if (goal === 'fat_loss') {
    multiplier = (activity === 'heavy' || activity === 'athlete') ? 2.2 : 2.0;
  } else if (goal === 'muscle_gain') {
    multiplier = (activity === 'heavy' || activity === 'athlete') ? 2.0 : 1.8;
  } else {
    if (activity === 'sedentary') multiplier = 1.0;
    else if (activity === 'light') multiplier = 1.3;
    else if (activity === 'moderate') multiplier = 1.6;
    else multiplier = 1.8;
  }
  return Math.min(350, Math.max(50, Math.round(weightKg * multiplier)));
}

function calcWaterLiters(weightKg, activity, climate) {
  let ml = weightKg * 35;
  const activityBonus = { sedentary: 0, light: 300, moderate: 500, heavy: 750, athlete: 1000 };
  ml += activityBonus[activity] || 500;
  if (climate === 'hot') ml += 500;
  else if (climate === 'cold') ml -= 200;
  return Math.round(ml / 100) / 10;
}

function calcNavyBodyFat(gender, heightCm, waistCm, neckCm, hipCm) {
  if (gender === 'male') {
    const bf = 86.010 * Math.log10(waistCm - neckCm) - 70.041 * Math.log10(heightCm) + 36.76;
    return Math.max(3, Math.min(60, Math.round(bf * 10) / 10));
  }
  const bf = 163.205 * Math.log10(waistCm + hipCm - neckCm) - 97.684 * Math.log10(heightCm) - 78.387;
  return Math.max(8, Math.min(60, Math.round(bf * 10) / 10));
}

function calcBMI(weightKg, heightCm) {
  const m = heightCm / 100;
  return Math.round((weightKg / (m * m)) * 10) / 10;
}

function calcOneRepMax(weight, reps) {
  return Math.round(weight * (1 + reps / 30));
}

function calcStepsCalories(steps, weightKg) {
  return Math.round(steps * 0.0005 * weightKg);
}

function monthsToReachBF(currentBF, targetBF, ratePerMonth) {
  return Math.ceil((currentBF - targetBF) / ratePerMonth);
}

function visibleAbsBF(gender) {
  return gender === 'male' ? 12 : 18;
}
