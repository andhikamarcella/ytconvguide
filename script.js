(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const toast = document.getElementById('toast');
  let toastTimer;

  const showToast = (message = 'Berhasil disalin') => {
    if (!toast) return;
    toast.querySelector('span').textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
    showToast();
  };

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-copy-target], [data-copy-text]');
    if (!button) return;
    const targetId = button.dataset.copyTarget;
    const text = targetId
      ? document.getElementById(targetId)?.textContent.trim()
      : button.dataset.copyText;
    if (text) copyText(text);
  });

  const savedTheme = localStorage.getItem('yt-conv-support-theme');
  const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (preferredDark ? 'dark' : 'light');

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    const label = document.getElementById('themeLabel');
    if (label) label.textContent = theme === 'dark' ? 'Mode terang' : 'Mode gelap';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#171717' : '#f7f7f8');
  };

  applyTheme(initialTheme);
  document.querySelectorAll('.theme-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('yt-conv-support-theme', next);
      applyTheme(next);
    });
  });

  const menuButton = document.getElementById('menuButton');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const setMenu = (open) => {
    body.classList.toggle('menu-open', open);
    menuButton?.setAttribute('aria-expanded', String(open));
    if (sidebarBackdrop) sidebarBackdrop.hidden = !open;
  };

  menuButton?.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
  sidebarBackdrop?.addEventListener('click', () => setMenu(false));
  document.querySelectorAll('.side-nav a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });

  document.querySelectorAll('.example-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const tabsWrap = tab.closest('.example-tabs');
      const targetId = tab.dataset.example;
      if (!tabsWrap || !targetId) return;
      tabsWrap.querySelectorAll('.example-tab').forEach((item) => item.classList.toggle('active', item === tab));
      const owner = tabsWrap.parentElement;
      owner?.querySelectorAll(':scope > .example-panel').forEach((panel) => panel.classList.toggle('active', panel.id === targetId));
    });
  });

  const videoUrl = document.getElementById('videoUrl');
  const formatSelect = document.getElementById('formatSelect');
  const qualitySelect = document.getElementById('qualitySelect');
  const cookieSelect = document.getElementById('cookieSelect');
  const qualityField = document.getElementById('qualityField');
  const cookieField = document.getElementById('cookieField');
  const generatedCommand = document.getElementById('generatedCommand');
  const commandLabel = document.getElementById('commandLabel');
  const builderTip = document.getElementById('builderTip');
  const urlMessage = document.getElementById('urlMessage');
  let platform = 'windows';

  const validateUrl = (value) => {
    if (!value.trim()) return { valid: true, value: 'TAUTAN_VIDEO', placeholder: true };
    try {
      const parsed = new URL(value.trim());
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('bad protocol');
      return { valid: true, value: parsed.href, placeholder: false };
    } catch {
      return { valid: false, value: 'TAUTAN_VIDEO', placeholder: true };
    }
  };

  const windowsCookieArg = (value) => {
    if (value === 'file') return '--cookies "%USERPROFILE%\\Downloads\\cookies.txt" ';
    if (['chrome', 'edge', 'firefox'].includes(value)) return `--cookies-from-browser ${value} `;
    return '';
  };

  const buildCommand = () => {
    if (!generatedCommand) return;
    const checked = validateUrl(videoUrl?.value || '');
    const url = checked.value;
    const format = formatSelect?.value || 'mp4';
    const quality = qualitySelect?.value || 'best';
    const cookies = cookieSelect?.value || 'none';

    if (urlMessage) {
      urlMessage.classList.toggle('error', !checked.valid);
      urlMessage.textContent = checked.valid
        ? (checked.placeholder ? 'Boleh dikosongkan dulu. Nanti akan muncul tulisan TAUTAN_VIDEO.' : 'Tautan terlihat benar dan sudah masuk ke perintah.')
        : 'Tautannya belum benar. Awali dengan http:// atau https://';
    }

    if (qualityField) qualityField.hidden = format === 'mp3';
    if (cookieField) cookieField.hidden = platform === 'android';

    let command;
    if (platform === 'windows') {
      const cookieArg = windowsCookieArg(cookies);
      const output = '-o "%USERPROFILE%\\Downloads\\%(title)s.%(ext)s"';
      if (format === 'mp3') {
        command = `yt-dlp ${cookieArg}-x --audio-format mp3 --audio-quality 0 ${output} "${url}"`;
      } else {
        const selector = quality === 'best'
          ? 'bv*+ba/b'
          : `bv*[height<=${quality}]+ba/b[height<=${quality}]`;
        command = `yt-dlp ${cookieArg}-f "${selector}" --merge-output-format mp4 ${output} "${url}"`;
      }
      if (commandLabel) commandLabel.textContent = 'Perintah untuk Windows CMD';
      if (builderTip) builderTip.textContent = cookies === 'none'
        ? 'File akan masuk ke folder Downloads Windows.'
        : 'Cookies diambil dari milikmu sendiri. Jangan membagikan file atau data cookies.';
    } else {
      const output = '-P "/sdcard/Download"';
      if (format === 'mp3') {
        command = `yt-dlp -x --audio-format mp3 --audio-quality 0 ${output} "${url}"`;
      } else {
        const selector = quality === 'best'
          ? 'bv*+ba/b'
          : `bv*[height<=${quality}]+ba/b[height<=${quality}]`;
        command = `yt-dlp -f "${selector}" --merge-output-format mp4 ${output} "${url}"`;
      }
      if (commandLabel) commandLabel.textContent = 'Perintah untuk Android Termux';
      if (builderTip) builderTip.textContent = 'File akan masuk ke folder Download Android. Jalankan termux-setup-storage lebih dulu.';
    }
    generatedCommand.textContent = command.replace(/\s{2,}/g, ' ').trim();
  };

  document.querySelectorAll('.builder-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      platform = tab.dataset.platform || 'windows';
      document.querySelectorAll('.builder-tab').forEach((item) => {
        const active = item === tab;
        item.classList.toggle('active', active);
        item.setAttribute('aria-selected', String(active));
      });
      buildCommand();
    });
  });

  [videoUrl, formatSelect, qualitySelect, cookieSelect].forEach((control) => {
    control?.addEventListener(control === videoUrl ? 'input' : 'change', buildCommand);
  });
  buildCommand();

  const progressInputs = [...document.querySelectorAll('[data-progress]')];
  const progressText = document.getElementById('progressText');
  const progressBar = document.getElementById('progressBar');
  const savedProgress = JSON.parse(localStorage.getItem('yt-conv-support-progress') || '{}');

  const updateProgress = () => {
    const state = {};
    progressInputs.forEach((input) => { state[input.dataset.progress] = input.checked; });
    localStorage.setItem('yt-conv-support-progress', JSON.stringify(state));
    const count = progressInputs.filter((input) => input.checked).length;
    if (progressText) progressText.textContent = `${count}/${progressInputs.length}`;
    if (progressBar) progressBar.style.width = `${progressInputs.length ? (count / progressInputs.length) * 100 : 0}%`;
  };

  progressInputs.forEach((input) => {
    input.checked = Boolean(savedProgress[input.dataset.progress]);
    input.addEventListener('change', updateProgress);
  });
  updateProgress();

  document.getElementById('resetProgress')?.addEventListener('click', () => {
    progressInputs.forEach((input) => { input.checked = false; });
    updateProgress();
    showToast('Penanda sudah diulang');
  });

  const faqSearch = document.getElementById('faqSearch');
  const faqItems = [...document.querySelectorAll('.faq-item')];
  const faqEmpty = document.getElementById('faqEmpty');
  faqSearch?.addEventListener('input', () => {
    const query = faqSearch.value.toLowerCase().trim();
    let visible = 0;
    faqItems.forEach((item) => {
      const haystack = `${item.textContent} ${item.dataset.keywords || ''}`.toLowerCase();
      const match = !query || haystack.includes(query);
      item.hidden = !match;
      if (match) visible += 1;
    });
    if (faqEmpty) faqEmpty.hidden = visible !== 0;
  });

  const navLinks = [...document.querySelectorAll('.nav-link')];
  const sections = [...document.querySelectorAll('.section-anchor')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`));
    }, { rootMargin: '-18% 0px -68% 0px', threshold: [0, .1, .3] });
    sections.forEach((section) => observer.observe(section));
  }
})();
