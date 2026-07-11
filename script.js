(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const toast = document.getElementById('toast');
  let toastTimer;

  const guides = {
    windows: {
      name: 'Windows 10/11', badge: 'W', type: 'Komputer', category: 'computer', tags: 'windows cmd winget', short: 'CMD + Winget',
      intro: 'Pakai CMD bawaan Windows.', openTitle: 'Buka CMD', openText: 'Tekan Start, ketik CMD, lalu buka.', shell: 'CMD',
      install: 'winget install yt-dlp.yt-dlp\nwinget install Gyan.FFmpeg',
      download: 'yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -P "%USERPROFILE%\\Downloads" "TAUTAN_VIDEO"',
      note: 'File masuk ke folder Downloads Windows.', platform: 'windows'
    },
    ubuntu: {
      name: 'Ubuntu & Debian', badge: 'U', type: 'Linux', category: 'linux computer', tags: 'ubuntu debian mint pop os zorin kali apt', short: 'APT',
      intro: 'Cocok untuk Ubuntu, Debian, Mint, Pop!_OS, Zorin, dan Kali.', openTitle: 'Buka Terminal', openText: 'Tekan Ctrl + Alt + T.', shell: 'Terminal',
      install: 'sudo apt update\nsudo apt install yt-dlp ffmpeg -y',
      download: 'yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -P "$HOME/Downloads" "TAUTAN_VIDEO"',
      note: 'File masuk ke folder Downloads.', platform: 'linux'
    },
    fedora: {
      name: 'Fedora', badge: 'F', type: 'Linux', category: 'linux computer', tags: 'fedora dnf rpm', short: 'DNF',
      intro: 'Untuk Fedora Workstation dan turunannya.', openTitle: 'Buka Terminal', openText: 'Buka aplikasi Terminal.', shell: 'Terminal',
      install: 'sudo dnf install yt-dlp ffmpeg-free -y',
      download: 'yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -P "$HOME/Downloads" "TAUTAN_VIDEO"',
      note: 'File masuk ke folder Downloads.', platform: 'linux'
    },
    arch: {
      name: 'Arch & turunannya', badge: 'A', type: 'Linux', category: 'linux computer', tags: 'arch manjaro endeavouros garuda cachyos pacman', short: 'Pacman',
      intro: 'Untuk Arch, Manjaro, EndeavourOS, Garuda, dan CachyOS.', openTitle: 'Buka Terminal', openText: 'Buka aplikasi Terminal.', shell: 'Terminal',
      install: 'sudo pacman -Syu yt-dlp ffmpeg',
      download: 'yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -P "$HOME/Downloads" "TAUTAN_VIDEO"',
      note: 'File masuk ke folder Downloads.', platform: 'linux'
    },
    opensuse: {
      name: 'openSUSE', badge: 'S', type: 'Linux', category: 'linux computer', tags: 'opensuse tumbleweed leap zypper', short: 'Zypper',
      intro: 'Untuk openSUSE Tumbleweed dan Leap.', openTitle: 'Buka Terminal', openText: 'Buka aplikasi Terminal.', shell: 'Terminal',
      install: 'sudo zypper install yt-dlp ffmpeg',
      download: 'yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -P "$HOME/Downloads" "TAUTAN_VIDEO"',
      note: 'File masuk ke folder Downloads.', platform: 'linux'
    },
    alpine: {
      name: 'Alpine Linux', badge: 'Al', type: 'Linux', category: 'linux computer', tags: 'alpine postmarketos apk', short: 'APK',
      intro: 'Untuk Alpine Linux dan postmarketOS.', openTitle: 'Buka Terminal', openText: 'Buka aplikasi Terminal.', shell: 'Terminal',
      install: 'sudo apk add yt-dlp ffmpeg',
      download: 'yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -P "$HOME/Downloads" "TAUTAN_VIDEO"',
      note: 'File masuk ke folder Downloads.', platform: 'linux'
    },
    universal: {
      name: 'Linux lainnya', badge: 'L', type: 'Linux', category: 'linux computer', tags: 'linux universal pip pipx python distro lainnya', short: 'Python',
      intro: 'Gunakan ini bila nama distromu tidak ada.', openTitle: 'Buka Terminal', openText: 'Buka aplikasi Terminal.', shell: 'Terminal',
      install: 'python3 -m pip install -U yt-dlp\n# Pasang FFmpeg dari toko aplikasi distro',
      download: 'yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -P "$HOME/Downloads" "TAUTAN_VIDEO"',
      note: 'Bila pip ditolak, cari paket yt-dlp dan FFmpeg di toko aplikasi distro.', platform: 'linux'
    },
    macos: {
      name: 'macOS', badge: 'M', type: 'Komputer', category: 'computer', tags: 'macos mac apple brew homebrew', short: 'Homebrew',
      intro: 'Untuk MacBook, iMac, dan Mac mini.', openTitle: 'Buka Terminal', openText: 'Buka Spotlight, ketik Terminal.', shell: 'Terminal',
      install: 'brew install yt-dlp ffmpeg',
      download: 'yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -P "$HOME/Downloads" "TAUTAN_VIDEO"',
      note: 'File masuk ke folder Downloads.', platform: 'macos',
      extra: 'Belum punya Homebrew? Buka brew.sh lalu ikuti satu perintah pemasangannya.'
    },
    android: {
      name: 'Android', badge: 'An', type: 'HP', category: 'mobile', tags: 'android termux samsung xiaomi oppo vivo realme hp', short: 'Termux',
      intro: 'Pakai Termux. File tetap masuk ke penyimpanan internal.', openTitle: 'Buka Termux', openText: 'Pasang APK Termux dari tombol di bawah, lalu buka.', shell: 'Termux',
      install: 'pkg update -y\npkg install python ffmpeg -y\npip install -U yt-dlp\ntermux-setup-storage',
      download: 'yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -P "$HOME/storage/downloads" "TAUTAN_VIDEO"',
      note: 'Saat izin muncul, tekan Izinkan. File masuk ke Penyimpanan internal → Download.', platform: 'android',
      extra: '<a class="button primary" href="https://f-droid.org/repo/com.termux_1022.apk" target="_blank" rel="noopener noreferrer">Unduh Termux APK</a><p class="inline-note"><strong>$HOME/storage/downloads</strong> adalah folder Download di penyimpanan internal, bukan kartu SD fisik.</p>'
    },
    chromeos: {
      name: 'ChromeOS', badge: 'Cr', type: 'Komputer', category: 'computer', tags: 'chromeos chromebook linux container', short: 'Linux container',
      intro: 'Aktifkan Linux development environment di Chromebook.', openTitle: 'Buka Terminal Linux', openText: 'Settings → Advanced → Developers → Linux development environment.', shell: 'Terminal',
      install: 'sudo apt update\nsudo apt install yt-dlp ffmpeg -y',
      download: 'yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -P "$HOME/Downloads" "TAUTAN_VIDEO"',
      note: 'File masuk ke folder Downloads di lingkungan Linux.', platform: 'linux'
    },
    steamdeck: {
      name: 'Steam Deck', badge: 'SD', type: 'Linux', category: 'linux computer', tags: 'steam deck steamos arch konsole pacman', short: 'Desktop Mode',
      intro: 'Masuk Desktop Mode lalu buka Konsole.', openTitle: 'Buka Konsole', openText: 'Steam → Power → Switch to Desktop.', shell: 'Konsole',
      install: 'sudo pacman -S yt-dlp ffmpeg',
      download: 'yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -P "$HOME/Downloads" "TAUTAN_VIDEO"',
      note: 'File masuk ke folder Downloads.', platform: 'linux'
    },
    ios: {
      name: 'iPhone & iPad', badge: 'i', type: 'HP', category: 'mobile', tags: 'iphone ipad ios safari', short: 'Pakai web',
      intro: 'Cara terminal tidak praktis di iPhone. Gunakan pilihan web.', openTitle: 'Buka Safari', openText: 'Pilih salah satu web pada bagian Tanpa instalasi.', shell: 'Safari',
      install: 'Tidak perlu memasang aplikasi.',
      download: 'Gunakan YT1s, noTube, atau Cobalt di bagian bawah.',
      note: 'Hasil biasanya masuk ke aplikasi Files → Downloads.', platform: 'ios'
    }
  };

  const showToast = (message = 'Berhasil disalin') => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1700);
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
    const target = button.dataset.copyTarget ? document.getElementById(button.dataset.copyTarget) : null;
    const text = target ? target.textContent.trim() : button.dataset.copyText;
    if (text) copyText(text);
  });

  const savedTheme = localStorage.getItem('yt-conv-support-theme');
  const initialTheme = savedTheme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    const label = document.getElementById('themeLabel');
    if (label) label.textContent = theme === 'dark' ? 'Mode terang' : 'Mode gelap';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#171717' : '#f7f7f5');
  };
  applyTheme(initialTheme);
  document.querySelectorAll('.theme-toggle').forEach((button) => button.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('yt-conv-support-theme', next);
    applyTheme(next);
  }));

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
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });

  const detectDevice = () => {
    const ua = navigator.userAgent.toLowerCase();
    const platform = (navigator.userAgentData?.platform || navigator.platform || '').toLowerCase();
    if (/android/.test(ua)) return 'android';
    if (/iphone|ipad|ipod/.test(ua) || (platform.includes('mac') && navigator.maxTouchPoints > 1)) return 'ios';
    if (/cros/.test(ua)) return 'chromeos';
    if (/windows|win32|win64/.test(`${ua} ${platform}`)) return 'windows';
    if (/macintosh|macintel|mac os/.test(`${ua} ${platform}`)) return 'macos';
    if (/linux|x11/.test(`${ua} ${platform}`)) return 'universal';
    return 'windows';
  };

  const deviceList = document.getElementById('deviceList');
  const deviceSearch = document.getElementById('deviceSearch');
  const deviceEmpty = document.getElementById('deviceEmpty');
  let activeGuide = detectDevice();
  let activeFilter = 'all';

  const renderDeviceButtons = () => {
    if (!deviceList) return;
    const query = (deviceSearch?.value || '').toLowerCase().trim();
    const entries = Object.entries(guides).filter(([, guide]) => {
      const filterMatch = activeFilter === 'all' || guide.category.includes(activeFilter);
      const searchMatch = !query || `${guide.name} ${guide.short} ${guide.tags}`.toLowerCase().includes(query);
      return filterMatch && searchMatch;
    });
    deviceList.innerHTML = entries.map(([key, guide]) => `
      <button class="device-button${key === activeGuide ? ' active' : ''}" type="button" data-guide="${key}">
        <span class="device-badge">${guide.badge}</span>
        <span><strong>${guide.name}</strong><small>${guide.short}</small></span>
      </button>`).join('');
    if (deviceEmpty) deviceEmpty.hidden = entries.length !== 0;
  };

  const renderGuide = (key, shouldScroll = false) => {
    const guide = guides[key] || guides.windows;
    activeGuide = key;
      document.getElementById('guideLogo').textContent = guide.badge;
    document.getElementById('guideTitle').textContent = guide.name;
    document.getElementById('guideType').textContent = guide.type;
    document.getElementById('guideIntro').textContent = guide.intro;
    document.getElementById('openTitle').textContent = guide.openTitle;
    document.getElementById('openText').textContent = guide.openText;
    document.getElementById('shellName').textContent = guide.shell;
    document.getElementById('installText').textContent = key === 'android' ? 'Jalankan satu per satu. Saat izin muncul, tekan Izinkan.' : 'Salin lalu jalankan.';
    document.getElementById('installCode').textContent = guide.install;
    document.getElementById('downloadCode').textContent = guide.download;
    document.getElementById('guideNote').textContent = guide.note;
    document.getElementById('downloadHelp').textContent = key === 'android' ? 'Ganti TAUTAN_VIDEO. Hasil masuk ke penyimpanan internal.' : 'Ganti TAUTAN_VIDEO dengan tautan videomu.';
    document.getElementById('guideExtra').innerHTML = guide.extra || '';
    document.getElementById('guideHint').textContent = key === 'universal' ? 'Browser melihat Linux, tetapi tidak dapat membaca nama distronya. Pilih distro bila kamu tahu.' : `${guide.name} dipilih.`;
    renderDeviceButtons();
    setBuilderPlatform(guide.platform === 'ios' ? 'android' : guide.platform, false);
    if (shouldScroll) document.getElementById('guideCard')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  deviceList?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-guide]');
    if (button) renderGuide(button.dataset.guide, true);
  });
  deviceSearch?.addEventListener('input', renderDeviceButtons);
  document.getElementById('deviceFilters')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    activeFilter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach((item) => item.classList.toggle('active', item === button));
    renderDeviceButtons();
  });

  const detected = guides[activeGuide];
  document.getElementById('detectedIcon').textContent = detected.badge;
  document.getElementById('detectedTitle').textContent = detected.name;
  document.getElementById('detectedText').textContent = activeGuide === 'universal'
    ? 'Linux terdeteksi. Pilih nama distro untuk perintah yang tepat.'
    : `Panduan ${detected.name} sudah disiapkan.`;
  document.getElementById('useDetectedButton')?.addEventListener('click', () => renderGuide(activeGuide, true));

  document.querySelectorAll('.example-tab').forEach((tab) => tab.addEventListener('click', () => {
    const targetId = tab.dataset.example;
    document.querySelectorAll('.example-tab').forEach((item) => item.classList.toggle('active', item === tab));
    document.querySelectorAll('.example-panel').forEach((panel) => panel.classList.toggle('active', panel.id === targetId));
  }));

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
  let builderPlatform = 'windows';

  const validateUrl = (value) => {
    if (!value.trim()) return { valid: true, value: 'TAUTAN_VIDEO', placeholder: true };
    try {
      const parsed = new URL(value.trim());
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error();
      return { valid: true, value: parsed.href, placeholder: false };
    } catch {
      return { valid: false, value: 'TAUTAN_VIDEO', placeholder: true };
    }
  };

  const cookieArg = (mode, platform) => {
    if (mode === 'none') return '';
    if (mode === 'file') {
      if (platform === 'windows') return '--cookies "%USERPROFILE%\\Downloads\\cookies.txt" ';
      return '--cookies "$HOME/Downloads/cookies.txt" ';
    }
    return `--cookies-from-browser ${mode} `;
  };

  const buildCommand = () => {
    const checked = validateUrl(videoUrl?.value || '');
    const format = formatSelect?.value || 'mp4';
    const quality = qualitySelect?.value || 'best';
    const cookies = cookieSelect?.value || 'none';
    const url = checked.value;

    if (urlMessage) {
      urlMessage.classList.toggle('error', !checked.valid);
      urlMessage.textContent = checked.valid
        ? (checked.placeholder ? 'Boleh dikosongkan dulu.' : 'Tautan sudah masuk ke perintah.')
        : 'Awali tautan dengan http:// atau https://';
    }
    if (qualityField) qualityField.hidden = format === 'mp3';
    if (cookieField) cookieField.hidden = builderPlatform === 'android';

    const output = {
      windows: '-P "%USERPROFILE%\\Downloads"',
      linux: '-P "$HOME/Downloads"',
      macos: '-P "$HOME/Downloads"',
      android: '-P "$HOME/storage/downloads"'
    }[builderPlatform];
    const cookiesPart = builderPlatform === 'android' ? '' : cookieArg(cookies, builderPlatform);
    const selector = quality === 'best' ? 'bv*+ba/b' : `bv*[height<=${quality}]+ba/b[height<=${quality}]`;
    const command = format === 'mp3'
      ? `yt-dlp ${cookiesPart}-x --audio-format mp3 --audio-quality 0 ${output} "${url}"`
      : `yt-dlp ${cookiesPart}-f "${selector}" --merge-output-format mp4 ${output} "${url}"`;

    generatedCommand.textContent = command.replace(/\s{2,}/g, ' ').trim();
    const labels = { windows: 'Windows CMD', linux: 'Linux Terminal', macos: 'macOS Terminal', android: 'Android Termux' };
    commandLabel.textContent = `Perintah untuk ${labels[builderPlatform]}`;
    builderTip.textContent = builderPlatform === 'android'
      ? 'File masuk ke Penyimpanan internal → Download. Jalankan termux-setup-storage lebih dulu.'
      : 'File masuk ke folder Downloads.';
  };

  function setBuilderPlatform(platform, shouldScroll = false) {
    builderPlatform = ['windows','linux','macos','android'].includes(platform) ? platform : 'windows';
    document.querySelectorAll('.builder-tab').forEach((tab) => {
      const active = tab.dataset.platform === builderPlatform;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    buildCommand();
    if (shouldScroll) document.getElementById('builder')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.querySelectorAll('.builder-tab').forEach((tab) => tab.addEventListener('click', () => setBuilderPlatform(tab.dataset.platform)));
  [videoUrl, formatSelect, qualitySelect, cookieSelect].forEach((control) => control?.addEventListener(control === videoUrl ? 'input' : 'change', buildCommand));
  buildCommand();
  renderDeviceButtons();
  renderGuide(activeGuide, false);

  const faqSearch = document.getElementById('faqSearch');
  const faqItems = [...document.querySelectorAll('.faq-item')];
  const faqEmpty = document.getElementById('faqEmpty');
  faqSearch?.addEventListener('input', () => {
    const query = faqSearch.value.toLowerCase().trim();
    let visible = 0;
    faqItems.forEach((item) => {
      const match = !query || `${item.textContent} ${item.dataset.keywords || ''}`.toLowerCase().includes(query);
      item.hidden = !match;
      if (match) visible += 1;
    });
    if (faqEmpty) faqEmpty.hidden = visible !== 0;
  });

  const navLinks = [...document.querySelectorAll('.nav-link')];
  const sections = [...document.querySelectorAll('.section-anchor')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`));
    }, { rootMargin: '-18% 0px -67% 0px', threshold: [0, .1, .3] });
    sections.forEach((section) => observer.observe(section));
  }

  const tourLayer = document.getElementById('tourLayer');
  const tourPopover = tourLayer?.querySelector('.tour-popover');
  const tourSteps = [
    { target: '#detectedCard', title: 'Perangkatmu', text: 'Situs memilih panduan yang paling cocok.' },
    { target: '#guide', title: 'Pilih perangkat', text: 'Pilih distro atau sistem operasi yang dipakai.' },
    { target: '#builder', title: 'Buat perintah', text: 'Tempel tautan lalu tekan Salin perintah.' },
    { target: '#cookies', title: 'Pasang cookies', text: 'Gunakan saat video meminta login.' },
    { target: '#fallback', title: 'Pilihan web', text: 'Pakai ini bila tidak ingin memasang aplikasi.' }
  ];
  let tourIndex = 0;
  let highlighted;

  const closeTour = () => {
    highlighted?.classList.remove('tour-highlight');
    highlighted = null;
    if (tourLayer) tourLayer.hidden = true;
  };

  const positionTour = () => {
    if (!tourPopover || !highlighted) return;
    const rect = highlighted.getBoundingClientRect();
    const gap = 14;
    const width = tourPopover.offsetWidth;
    const height = tourPopover.offsetHeight;
    let top = rect.bottom + gap;
    if (top + height > innerHeight - 12) top = Math.max(12, rect.top - height - gap);
    let left = Math.min(innerWidth - width - 12, Math.max(12, rect.left));
    tourPopover.style.top = `${top}px`;
    tourPopover.style.left = `${left}px`;
  };

  const showTourStep = () => {
    highlighted?.classList.remove('tour-highlight');
    const step = tourSteps[tourIndex];
    highlighted = document.querySelector(step.target);
    if (!highlighted || !tourLayer) return closeTour();
    tourLayer.hidden = false;
    highlighted.scrollIntoView({ behavior: 'smooth', block: 'center' });
    highlighted.classList.add('tour-highlight');
    document.getElementById('tourCount').textContent = `${tourIndex + 1}/${tourSteps.length}`;
    document.getElementById('tourTitle').textContent = step.title;
    document.getElementById('tourText').textContent = step.text;
    document.getElementById('tourNext').textContent = tourIndex === tourSteps.length - 1 ? 'Selesai' : 'Lanjut';
    setTimeout(positionTour, 380);
  };

  document.getElementById('startTourButton')?.addEventListener('click', () => { tourIndex = 0; showTourStep(); });
  document.getElementById('tourNext')?.addEventListener('click', () => {
    if (tourIndex >= tourSteps.length - 1) return closeTour();
    tourIndex += 1;
    showTourStep();
  });
  document.getElementById('tourClose')?.addEventListener('click', closeTour);
  tourLayer?.querySelector('.tour-shade')?.addEventListener('click', closeTour);
  addEventListener('resize', () => { if (tourLayer && !tourLayer.hidden) positionTour(); });
})();
