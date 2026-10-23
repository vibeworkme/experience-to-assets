(() => {
  const section = document.querySelector('#video-learning');
  if (!section) return;
  const units = [...section.querySelectorAll('.learning-unit')];
  const links = [...section.querySelectorAll('[data-lesson-link]')];
  const checks = [...section.querySelectorAll('[data-complete]')];
  const key = 'experience-to-assets.learning.v1';
  let completed = [];
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(saved)) completed = saved.filter(id => checks.some(c => c.dataset.complete === id));
  } catch { completed = []; }
  function progress() {
    checks.forEach(c => { c.checked = completed.includes(c.dataset.complete); });
    section.querySelector('#learn-progress-count').textContent = `${completed.length} / ${units.length}`;
    section.querySelectorAll('.learning-nav [data-lesson-link]').forEach(a => {
      a.querySelector('.learn-done').hidden = !completed.includes(a.dataset.lessonLink);
    });
  }
  function select(id, move = false) {
    const target = units.find(u => u.id === `learn-${id}`);
    if (!target) return;
    units.forEach(u => {
      u.classList.toggle('is-active', u === target);
      if (u !== target) u.querySelector('video').pause();
    });
    section.classList.add('learning-ready');
    links.forEach(a => {
      if (a.closest('.learning-nav') && a.dataset.lessonLink === id) a.setAttribute('aria-current', 'step');
      else a.removeAttribute('aria-current');
    });
    if (move) {
      history.replaceState(null, '', `#learn-${id}`);
      target.scrollIntoView({block:'start', behavior:'instant'});
      const heading = target.querySelector('h3');
      heading.tabIndex = -1;
      heading.focus({preventScroll:true});
    }
  }
  links.forEach(a => a.addEventListener('click', event => {
    event.preventDefault();
    select(a.dataset.lessonLink, true);
  }));
  checks.forEach(c => c.addEventListener('change', () => {
    completed = checks.filter(input => input.checked).map(input => input.dataset.complete);
    try { localStorage.setItem(key, JSON.stringify(completed)); } catch {
      section.querySelector('.learn-progress span').textContent = '이 브라우저에서는 완료 표시가 새로고침하면 초기화됩니다.';
    }
    progress();
  }));
  section.querySelectorAll('[data-copy-prompt]').forEach(button => button.addEventListener('click', async () => {
    const prompt = document.getElementById(`learn-prompt-${button.dataset.copyPrompt}`);
    const status = button.closest('details').querySelector('.learn-copy-status');
    try {
      await navigator.clipboard.writeText(prompt.textContent);
      status.textContent = '요청문을 복사했습니다. 대화창에 붙여넣고 대괄호 부분을 내 자료로 바꾸세요.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(prompt);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = '자동 복사를 사용할 수 없습니다. 선택된 요청문을 직접 복사하세요.';
    }
  }));
  const fromHash = () => location.hash.match(/^#learn-(0[1-8])$/)?.[1];
  select(fromHash() || '01');
  window.addEventListener('hashchange', () => { if (fromHash()) select(fromHash()); });
  progress();
})();
