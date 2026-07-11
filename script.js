(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const body = document.body;
  const root = document.documentElement;
  const toast = $('#toast');
  let toastTimer;

  const showToast = (text = 'Tersalin') => {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1600);
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
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
    const trigger = event.target.closest('[data-copy-target],[data-copy-text]');
    if (!trigger) return;
    const target = trigger.dataset.copyTarget ? $(`#${trigger.dataset.copyTarget}`) : null;
    const text = trigger.dataset.copyText || target?.textContent?.trim();
    if (text) copyText(text);
  });

  const savedTheme = localStorage.getItem('ytcs-theme');
  const initialTheme = savedTheme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    $('#themeText').textContent = theme === 'dark' ? 'Mode terang' : 'Mode gelap';
    $('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#171716' : '#f7f7f5');
  };
  applyTheme(initialTheme);
  $$('.theme-btn').forEach((btn) => btn.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('ytcs-theme', next);
    applyTheme(next);
  }));

  const menuBtn = $('#menuBtn');
  const backdrop = $('#backdrop');
  const setMenu = (open) => {
    body.classList.toggle('menu-open', open);
    menuBtn?.setAttribute('aria-expanded', String(open));
    if (backdrop) backdrop.hidden = !open;
  };
  menuBtn?.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
  backdrop?.addEventListener('click', () => setMenu(false));
  $$('.nav-link').forEach((link) => link.addEventListener('click', () => setMenu(false)));

  const platformText = (key) => ({ windows: 'Windows', linux: 'Linux', macos: 'macOS', android: 'Android', ios: 'iPhone/iPad', chromeos: 'ChromeOS' }[key] || 'Perangkat');

  function detectDevice() {
    const ua = navigator.userAgent || '';
    const uaPlatform = navigator.userAgentData?.platform || navigator.platform || '';
    const touchMac = /Mac/i.test(uaPlatform) && navigator.maxTouchPoints > 1;
    let key = 'linux';
    if (/CrOS/i.test(ua)) key = 'chromeos';
    else if (/Android/i.test(ua)) key = 'android';
    else if (/iPhone|iPad|iPod/i.test(ua) || touchMac) key = 'ios';
    else if (/Win/i.test(uaPlatform) || /Windows/i.test(ua)) key = 'windows';
    else if (/Mac/i.test(uaPlatform) || /Macintosh/i.test(ua)) key = 'macos';
    else if (/Linux/i.test(uaPlatform) || /Linux/i.test(ua)) key = 'linux';

    let browser = 'browser';
    if (/Edg\//.test(ua)) browser = 'Edge';
    else if (/Firefox\//.test(ua)) browser = 'Firefox';
    else if (/Chrome\//.test(ua) || /CriOS\//.test(ua)) browser = 'Chrome';
    else if (/Safari\//.test(ua)) browser = 'Safari';

    let guide = key;
    if (key === 'linux') {
      if (/Ubuntu/i.test(ua)) guide = 'ubuntu';
      else if (/Fedora/i.test(ua)) guide = 'fedora';
      else if (/Arch/i.test(ua)) guide = 'arch';
      else guide = 'universal-linux';
    }
    return { key, guide, browser, label: platformText(key) };
  }

  const guides = {
    windows: { icon:'W', type:'Komputer', name:'Windows 10/11', intro:'CMD + Winget.', openTitle:'Buka CMD', openText:'Tekan Start, ketik CMD, lalu buka.', shell:'CMD', install:'winget install yt-dlp.yt-dlp\nwinget install Gyan.FFmpeg', download:'yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -P "%USERPROFILE%\\Downloads" "TAUTAN_VIDEO"', note:'Setelah instalasi, tutup lalu buka CMD lagi.', category:'computer', keywords:'windows 10 11 microsoft winget cmd' },
    ubuntu: { icon:'U', type:'Linux', name:'Ubuntu & Debian', intro:'Juga cocok untuk Mint, Pop!_OS, Zorin, dan Kali.', openTitle:'Buka Terminal', openText:'Tekan Ctrl + Alt + T.', shell:'Terminal', install:'sudo apt update && sudo apt install -y yt-dlp ffmpeg', download:'yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -P "$HOME/Downloads" "TAUTAN_VIDEO"', note:'Pilih ini untuk distro berbasis Ubuntu/Debian.', category:'linux computer', keywords:'ubuntu debian mint pop zorin kali apt' },
    fedora: { icon:'F', type:'Linux', name:'Fedora', intro:'Memakai DNF.', openTitle:'Buka Terminal', openText:'Buka aplikasi Terminal.', shell:'Terminal', install:'sudo dnf install -y yt-dlp ffmpeg-free', download:'yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -P "$HOME/Downloads" "TAUTAN_VIDEO"', note:'Jika format tertentu gagal, gunakan pilihan web cadangan.', category:'linux computer', keywords:'fedora dnf redhat workstation' },
    arch: { icon:'A', type:'Linux', name:'Arch & turunannya', intro:'Arch, Manjaro, EndeavourOS, Garuda, CachyOS.', openTitle:'Buka Terminal', openText:'Buka aplikasi Terminal.', shell:'Terminal', install:'sudo pacman -Syu --needed yt-dlp ffmpeg', download:'yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -P "$HOME/Downloads" "TAUTAN_VIDEO"', note:'Perintah ini memakai Pacman.', category:'linux computer', keywords:'arch manjaro endeavour garuda cachyos pacman' },
    opensuse: { icon:'S', type:'Linux', name:'openSUSE', intro:'Tumbleweed dan Leap.', openTitle:'Buka Terminal', openText:'Buka aplikasi Terminal.', shell:'Terminal', install:'sudo zypper install yt-dlp ffmpeg', download:'yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -P "$HOME/Downloads" "TAUTAN_VIDEO"', note:'Jika FFmpeg tidak tersedia, gunakan paket multimedia dari repositori distro.', category:'linux computer', keywords:'opensuse tumbleweed leap zypper suse' },
    alpine: { icon:'Al', type:'Linux', name:'Alpine Linux', intro:'Memakai APK.', openTitle:'Buka Terminal', openText:'Buka terminal Alpine.', shell:'Terminal', install:'sudo apk add yt-dlp ffmpeg', download:'yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -P "$HOME/Downloads" "TAUTAN_VIDEO"', note:'Juga dapat dipakai pada sistem berbasis Alpine.', category:'linux computer', keywords:'alpine postmarketos apk' },
    'universal-linux': { icon:'∞', type:'Linux', name:'Linux terdeteksi', intro:'Pilih distro di atas bila kamu tahu namanya.', openTitle:'Buka Terminal', openText:'Cari aplikasi Terminal.', shell:'Terminal', install:'python3 -m pip install --user -U yt-dlp\nffmpeg -version', download:'yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -P "$HOME/Downloads" "TAUTAN_VIDEO"', note:'Baris kedua hanya mengecek FFmpeg. Bila tidak ditemukan, pasang FFmpeg lewat Software Manager.', category:'linux computer', keywords:'linux universal distro lain python pip' },
    macos: { icon:'M', type:'Komputer', name:'macOS', intro:'MacBook dan iMac.', openTitle:'Buka Terminal', openText:'Buka Spotlight, ketik Terminal.', shell:'Terminal', install:'brew install yt-dlp ffmpeg', download:'yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -P "$HOME/Downloads" "TAUTAN_VIDEO"', note:'Perintah ini membutuhkan Homebrew.', category:'computer', keywords:'macos macbook imac apple homebrew brew' },
    android: { icon:'An', type:'HP', name:'Android + Termux', intro:'Samsung, Xiaomi, OPPO, Vivo, Realme, dan lainnya.', openTitle:'Pasang Termux', openText:'Unduh APK dari tombol di bawah.', shell:'Termux', install:'pkg update -y && pkg install -y python ffmpeg\npip install -U yt-dlp\ntermux-setup-storage', download:'yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -P "/sdcard/Download" "TAUTAN_VIDEO"', note:'Saat diminta izin penyimpanan, tekan Izinkan.', category:'mobile', keywords:'android samsung xiaomi oppo vivo realme termux', extra:'termux' },
    chromeos: { icon:'C', type:'Komputer', name:'ChromeOS / Chromebook', intro:'Gunakan Linux Development Environment.', openTitle:'Aktifkan Linux', openText:'Settings → Developers → Linux development environment.', shell:'Linux Terminal', install:'sudo apt update && sudo apt install -y yt-dlp ffmpeg', download:'yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -P "$HOME/Downloads" "TAUTAN_VIDEO"', note:'Folder Linux berbeda dari folder Downloads ChromeOS.', category:'linux computer', keywords:'chromeos chromebook cros linux development' },
    steamdeck: { icon:'SD', type:'Konsol', name:'Steam Deck', intro:'Masuk ke Desktop Mode.', openTitle:'Buka Konsole', openText:'Desktop Mode → buka Konsole.', shell:'Konsole', install:'python3 -m pip install --user -U yt-dlp\nffmpeg -version', download:'yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -P "$HOME/Downloads" "TAUTAN_VIDEO"', note:'Jika FFmpeg tidak tersedia, gunakan pilihan web agar tidak mengubah SteamOS.', category:'linux computer', keywords:'steam deck steamos desktop mode' },
    ios: { icon:'i', type:'HP', name:'iPhone & iPad', intro:'Gunakan pilihan web.', openTitle:'Buka Safari', openText:'Pilih salah satu web cadangan.', shell:'Tidak perlu terminal', install:'Tidak perlu memasang yt-dlp.', download:'Buka bagian “Tanpa instalasi” di bawah.', note:'iPhone/iPad tidak menjalankan Termux Android.', category:'mobile', keywords:'iphone ipad ios safari apple' }
  };

  const deviceOrder = ['windows','ubuntu','fedora','arch','opensuse','alpine','universal-linux','macos','android','chromeos','steamdeck','ios'];
  const detected = detectDevice();
  let selectedGuide = detected.guide;
  let deviceFilter = 'all';

  const detectedIcon = $('#detectedIcon');
  const detectedTitle = $('#detectedTitle');
  const detectedText = $('#detectedText');
  if (detectedIcon) detectedIcon.textContent = guides[selectedGuide]?.icon || '?';
  if (detectedTitle) detectedTitle.textContent = detected.key === 'linux' ? 'Linux terdeteksi' : detected.label;
  if (detectedText) detectedText.textContent = detected.key === 'linux'
    ? 'Nama distro tidak selalu terlihat. Pilih distro bila perlu.'
    : `${detected.browser} • panduan sudah disiapkan.`;

  function renderDevices() {
    const list = $('#deviceList');
    const query = ($('#deviceSearch')?.value || '').toLowerCase().trim();
    if (!list) return;
    list.innerHTML = '';
    let count = 0;
    deviceOrder.forEach((key) => {
      const item = guides[key];
      const matchFilter = deviceFilter === 'all' || item.category.includes(deviceFilter);
      const matchQuery = !query || `${item.name} ${item.intro} ${item.keywords}`.toLowerCase().includes(query);
      if (!matchFilter || !matchQuery) return;
      count += 1;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `device-btn${key === selectedGuide ? ' active' : ''}`;
      btn.dataset.guide = key;
      btn.innerHTML = `<span class="device-badge">${item.icon}</span><span><strong>${item.name}</strong><small>${item.intro}</small></span>`;
      btn.addEventListener('click', () => selectGuide(key, true));
      list.appendChild(btn);
    });
    $('#deviceEmpty').hidden = count > 0;
  }

  function selectGuide(key, scroll = false) {
    const guide = guides[key] || guides.windows;
    selectedGuide = key;
    $('#guideLogo').textContent = guide.icon;
    $('#guideType').textContent = guide.type;
    $('#guideTitle').textContent = guide.name;
    $('#guideIntro').textContent = guide.intro;
    $('#openTitle').textContent = guide.openTitle;
    $('#openText').textContent = guide.openText;
    $('#shellName').textContent = guide.shell;
    $('#installText').textContent = key === 'ios' ? 'Tidak perlu instalasi.' : 'Salin lalu jalankan.';
    $('#installCode').textContent = guide.install;
    $('#downloadCode').textContent = guide.download;
    $('#guideNote').textContent = guide.note;
    const extra = $('#guideExtra');
    extra.innerHTML = guide.extra === 'termux'
      ? '<a class="button primary guide-extra-btn" href="https://f-droid.org/repo/com.termux_1022.apk" target="_blank" rel="noopener noreferrer">Unduh Termux APK</a>'
      : '';
    renderDevices();
    syncBuilderToGuide(key);
    if (scroll) $('#guideCard')?.scrollIntoView({ behavior:'smooth', block:'center' });
  }

  $('#deviceSearch')?.addEventListener('input', renderDevices);
  $$('#deviceFilters .chip').forEach((chip) => chip.addEventListener('click', () => {
    deviceFilter = chip.dataset.filter || 'all';
    $$('#deviceFilters .chip').forEach((c) => c.classList.toggle('active', c === chip));
    renderDevices();
  }));

  $('#useDetectedBtn')?.addEventListener('click', () => {
    selectGuide(detected.guide);
    $('#guide')?.scrollIntoView({ behavior:'smooth' });
  });

  let builderPlatform = 'windows';
  const platformFromGuide = (key) => {
    if (key === 'android') return 'android';
    if (key === 'macos') return 'macos';
    if (key === 'windows') return 'windows';
    return guides[key]?.category.includes('linux') ? 'linux' : 'windows';
  };
  function syncBuilderToGuide(key) {
    const next = platformFromGuide(key);
    setBuilderPlatform(next);
  }
  function setBuilderPlatform(next) {
    builderPlatform = next;
    $$('.platform-tab').forEach((tab) => tab.classList.toggle('active', tab.dataset.platform === next));
    buildCommand();
  }
  $$('.platform-tab').forEach((tab) => tab.addEventListener('click', () => setBuilderPlatform(tab.dataset.platform)));

  function validUrl(value) {
    if (!value.trim()) return { ok:true, value:'TAUTAN_VIDEO', blank:true };
    try {
      const url = new URL(value.trim());
      if (!['http:','https:'].includes(url.protocol)) throw new Error();
      return { ok:true, value:url.href, blank:false };
    } catch { return { ok:false, value:'TAUTAN_VIDEO', blank:true }; }
  }
  function cookieArg(mode, platform) {
    if (mode === 'none') return '';
    if (mode === 'file') {
      if (platform === 'windows') return '--cookies "%USERPROFILE%\\Downloads\\cookies.txt" ';
      if (platform === 'android') return '--cookies "/sdcard/Download/cookies.txt" ';
      return '--cookies "$HOME/Downloads/cookies.txt" ';
    }
    return `--cookies-from-browser ${mode} `;
  }
  function buildCommand() {
    const checked = validUrl($('#videoUrl')?.value || '');
    const format = $('#format')?.value || 'mp4';
    const quality = $('#quality')?.value || 'best';
    let mode = $('#cookieMode')?.value || 'none';
    if (builderPlatform === 'android' && ['chrome','edge','firefox'].includes(mode)) mode = 'none';
    const output = builderPlatform === 'windows' ? '-P "%USERPROFILE%\\Downloads"' : builderPlatform === 'android' ? '-P "/sdcard/Download"' : '-P "$HOME/Downloads"';
    const cookies = cookieArg(mode, builderPlatform);
    let command;
    if (format === 'mp3') command = `yt-dlp ${cookies}-x --audio-format mp3 --audio-quality 0 ${output} "${checked.value}"`;
    else {
      const selector = quality === 'best' ? 'bv*+ba/b' : `bv*[height<=${quality}]+ba/b[height<=${quality}]`;
      command = `yt-dlp ${cookies}-f "${selector}" --merge-output-format mp4 ${output} "${checked.value}"`;
    }
    $('#resultCode').textContent = command.replace(/\s{2,}/g,' ').trim();
    $('#resultLabel').textContent = ({windows:'Windows CMD',linux:'Linux Terminal',macos:'macOS Terminal',android:'Android Termux'})[builderPlatform];
    $('#qualityField').hidden = format === 'mp3';
    $('#urlHelp').textContent = checked.ok ? (checked.blank ? 'Boleh dikosongkan.' : 'Tautan siap.') : 'Tautan belum benar.';
    $('#urlHelp').style.color = checked.ok ? '' : 'var(--danger)';
    $('#resultNote').textContent = builderPlatform === 'android' ? 'File masuk ke Download Android.' : 'File masuk ke folder Downloads.';
  }
  ['videoUrl','format','quality','cookieMode'].forEach((id) => {
    const el = $(`#${id}`);
    el?.addEventListener(id === 'videoUrl' ? 'input' : 'change', buildCommand);
  });

  $$('.install-tab').forEach((tab) => tab.addEventListener('click', () => {
    const manual = tab.dataset.extensionMode === 'manual';
    $$('.install-tab').forEach((t) => t.classList.toggle('active', t === tab));
    $('#manualFlow').hidden = !manual;
    $('#storeFlow').hidden = manual;
  }));

  const errorSearch = $('#errorSearch');
  errorSearch?.addEventListener('input', () => {
    const query = errorSearch.value.toLowerCase().trim();
    let visible = 0;
    $$('#errorList details').forEach((item) => {
      const show = !query || `${item.textContent} ${item.dataset.keywords}`.toLowerCase().includes(query);
      item.hidden = !show;
      if (show) visible += 1;
    });
    $('#errorEmpty').hidden = visible > 0;
  });

  const backTop = $('#backTop');
  const onScroll = () => backTop?.classList.toggle('show', scrollY > 500);
  addEventListener('scroll', onScroll, { passive:true });
  backTop?.addEventListener('click', () => scrollTo({ top:0, behavior:'smooth' }));

  const navLinks = $$('.nav-link');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const current = entries.filter((e) => e.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
      if (!current) return;
      navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${current.target.id}`));
    }, { rootMargin:'-20% 0px -65% 0px', threshold:[0,.15,.4] });
    $$('.anchor').forEach((section) => observer.observe(section));
  }

  const tour = $('#tour');
  const tourFocus = $('#tourFocus');
  const tourPopover = $('#tourPopover');
  let tourIndex = 0;
  const tourSteps = [
    { selector:'#detectedCard', title:'Perangkatmu', text: detected.key === 'linux' ? 'Linux terdeteksi. Pilih distro bila perlu.' : `Panduan ${detected.label} sudah dipilih.` },
    { selector:'#guideCard', title:'Langkah pemasangan', text:'Salin perintah sesuai perangkat.' },
    { selector:'.builder-card', title:'Buat perintah', text:'Tempel tautan, pilih MP4 atau MP3.' },
    { selector:'#extensionSteps', title:'Jika diminta login', text:'Pasang extension lalu ekspor cookies.txt.' },
    { selector:'#fallback .web-grid', title:'Pilihan cepat', text:'Gunakan web cadangan bila tidak ingin instalasi.' }
  ];

  function positionTour() {
    const step = tourSteps[tourIndex];
    const target = $(step.selector);
    if (!target || !tourFocus || !tourPopover) return;
    const rect = target.getBoundingClientRect();
    const pad = 7;
    tourFocus.style.left = `${Math.max(6, rect.left-pad)}px`;
    tourFocus.style.top = `${Math.max(6, rect.top-pad)}px`;
    tourFocus.style.width = `${Math.min(innerWidth-12, rect.width+pad*2)}px`;
    tourFocus.style.height = `${Math.min(innerHeight-12, rect.height+pad*2)}px`;
    const popWidth = Math.min(330, innerWidth-24);
    const below = rect.bottom + 12;
    const top = below + 190 < innerHeight ? below : Math.max(12, rect.top - 200);
    const left = Math.min(innerWidth-popWidth-12, Math.max(12, rect.left));
    tourPopover.style.left = `${left}px`;
    tourPopover.style.top = `${top}px`;
    $('#tourCount').textContent = `${tourIndex+1}/${tourSteps.length}`;
    $('#tourTitle').textContent = step.title;
    $('#tourText').textContent = step.text;
    $('#tourBack').style.visibility = tourIndex === 0 ? 'hidden' : 'visible';
    $('#tourNext').textContent = tourIndex === tourSteps.length-1 ? 'Selesai' : 'Lanjut';
  }
  function showTourStep() {
    const target = $(tourSteps[tourIndex].selector);
    target?.scrollIntoView({ behavior:'smooth', block:'center' });
    setTimeout(positionTour, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 380);
  }
  function startTour() {
    tourIndex = 0;
    tour.hidden = false;
    body.style.overflow = 'hidden';
    showTourStep();
  }
  function closeTour() {
    tour.hidden = true;
    body.style.overflow = '';
    localStorage.setItem('ytcs-tour-seen','1');
  }
  $('#startTourBtn')?.addEventListener('click', startTour);
  $('#tourSkip')?.addEventListener('click', closeTour);
  $('#tourBack')?.addEventListener('click', () => { if (tourIndex > 0) { tourIndex -= 1; showTourStep(); } });
  $('#tourNext')?.addEventListener('click', () => {
    if (tourIndex >= tourSteps.length-1) closeTour();
    else { tourIndex += 1; showTourStep(); }
  });
  addEventListener('resize', () => { if (!tour.hidden) positionTour(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !tour.hidden) closeTour(); });

  renderDevices();
  selectGuide(selectedGuide);
  setBuilderPlatform(platformFromGuide(selectedGuide));
  buildCommand();
})();
