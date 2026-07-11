(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toastText');
  let toastTimer;

  const showToast = (message = 'Berhasil disalin') => {
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
  };

  const copyText = async (text) => {
    if (!text) return false;
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      const copied = document.execCommand('copy');
      area.remove();
      return copied;
    }
  };

  document.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-copy-target]');
    if (!button) return;
    const target = document.getElementById(button.dataset.copyTarget);
    const copied = await copyText(target?.textContent?.trim() || '');
    showToast(copied ? 'Perintah berhasil disalin' : 'Tidak bisa menyalin');
  });

  const preferredTheme = localStorage.getItem('yt-conv-support-theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    const label = document.getElementById('themeLabel');
    if (label) label.textContent = theme === 'dark' ? 'Mode terang' : 'Mode gelap';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#181918' : '#f7f7f5');
  };

  applyTheme(preferredTheme);
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
  const installHelpLink = document.getElementById('installHelpLink');
  let platform = 'windows';

  const platformNames = { windows: 'Windows', linux: 'Linux', macos: 'macOS', android: 'Android Termux' };
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

  const cookieArg = (value, currentPlatform) => {
    if (value === 'none') return '';
    if (value === 'file') {
      return currentPlatform === 'windows'
        ? '--cookies "%USERPROFILE%\\Downloads\\cookies.txt" '
        : '--cookies "$HOME/Downloads/cookies.txt" ';
    }
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
        ? (checked.placeholder ? 'Boleh dikosongkan. Nanti tertulis TAUTAN_VIDEO.' : 'Tautan terlihat benar dan sudah dimasukkan.')
        : 'Tautan belum benar. Awali dengan http:// atau https://';
    }

    if (qualityField) qualityField.hidden = format === 'mp3';
    if (cookieField) cookieField.hidden = platform === 'android';

    const browserCookies = platform === 'android' ? '' : cookieArg(cookies, platform);
    const output = platform === 'windows'
      ? '-o "%USERPROFILE%\\Downloads\\%(title)s.%(ext)s"'
      : platform === 'android'
        ? '-P "/sdcard/Download"'
        : '-o "$HOME/Downloads/%(title)s.%(ext)s"';

    let command;
    if (format === 'mp3') {
      command = `yt-dlp ${browserCookies}-x --audio-format mp3 --audio-quality 0 ${output} "${url}"`;
    } else {
      const selector = quality === 'best' ? 'bv*+ba/b' : `bv*[height<=${quality}]+ba/b[height<=${quality}]`;
      command = `yt-dlp ${browserCookies}-f "${selector}" --merge-output-format mp4 ${output} "${url}"`;
    }

    generatedCommand.textContent = command.replace(/\s{2,}/g, ' ').trim();
    if (commandLabel) commandLabel.textContent = `Perintah untuk ${platformNames[platform]}`;
    if (builderTip) {
      builderTip.textContent = platform === 'windows'
        ? 'File akan masuk ke folder Downloads Windows.'
        : platform === 'android'
          ? 'File masuk ke Download Android. Jalankan termux-setup-storage lebih dulu.'
          : 'File akan masuk ke folder Downloads milik pengguna saat ini.';
    }
    if (installHelpLink) installHelpLink.dataset.targetGuide = platform === 'linux' ? 'ubuntu' : platform;
  };

  const selectBuilderPlatform = (nextPlatform) => {
    platform = nextPlatform;
    document.querySelectorAll('.builder-tab').forEach((item) => {
      const active = item.dataset.platform === platform;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
    buildCommand();
  };

  document.querySelectorAll('.builder-tab').forEach((tab) => tab.addEventListener('click', () => selectBuilderPlatform(tab.dataset.platform || 'windows')));
  [videoUrl, formatSelect, qualitySelect, cookieSelect].forEach((control) => control?.addEventListener(control === videoUrl ? 'input' : 'change', buildCommand));
  buildCommand();

  const guides = {
    windows: {
      icon: 'W', kicker: 'Komputer', title: 'Windows 10/11', status: 'Paling mudah', shell: 'CMD sebagai Administrator',
      description: 'Gunakan Winget agar yt-dlp dan FFmpeg terpasang otomatis tanpa memindahkan file secara manual.',
      openTitle: 'Buka CMD sebagai Administrator', openText: 'Tekan tombol Windows, ketik CMD, lalu pilih Run as administrator.',
      installNote: 'Salin dua baris ini. Tunggu baris pertama selesai sebelum baris kedua berjalan.',
      install: 'winget install --id yt-dlp.yt-dlp --exact --accept-source-agreements --accept-package-agreements\nwinget install --id Gyan.FFmpeg --exact --accept-source-agreements --accept-package-agreements',
      check: 'yt-dlp --version\nffmpeg -version',
      download: 'yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -o "%USERPROFILE%\\Downloads\\%(title)s.%(ext)s" "TAUTAN_VIDEO"',
      downloadNote: 'Ganti TAUTAN_VIDEO dengan tautan yang ingin diunduh.',
      note: '<strong>Setelah memasang:</strong> tutup CMD dan buka lagi agar perintah baru terbaca.'
    },
    ubuntu: {
      icon: 'U', kicker: 'Linux berbasis Debian', title: 'Ubuntu, Debian, Mint, Pop!_OS, Zorin, dan Kali', status: 'APT', shell: 'Terminal',
      description: 'Cara ini cocok untuk keluarga Debian. Nama paket dapat sedikit berbeda pada rilis lama, jadi perbarui daftar paket terlebih dahulu.',
      openTitle: 'Buka Terminal', openText: 'Tekan Ctrl + Alt + T atau cari aplikasi Terminal dari menu aplikasi.',
      installNote: 'Perbarui daftar paket, lalu pasang yt-dlp dan FFmpeg.',
      install: 'sudo apt update\nsudo apt install -y yt-dlp ffmpeg',
      check: 'yt-dlp --version\nffmpeg -version',
      download: 'yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -o "$HOME/Downloads/%(title)s.%(ext)s" "TAUTAN_VIDEO"',
      downloadNote: 'Hasil akan masuk ke folder Downloads di Home.',
      note: '<strong>Bila yt-dlp terlalu lama:</strong> gunakan kartu “Linux distro lainnya” untuk memasang versi resmi langsung dari GitHub.'
    },
    fedora: {
      icon: 'F', kicker: 'Linux', title: 'Fedora Workstation', status: 'DNF', shell: 'Terminal',
      description: 'Fedora menyediakan paket yt-dlp dan ffmpeg-free dari repositori resminya.',
      openTitle: 'Buka Terminal', openText: 'Cari Terminal dari daftar aplikasi atau tekan tombol Super lalu ketik Terminal.',
      installNote: 'Pasang yt-dlp dan FFmpeg Free dengan DNF.',
      install: 'sudo dnf install -y yt-dlp ffmpeg-free',
      check: 'yt-dlp --version\nffmpeg -version',
      download: 'yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -o "$HOME/Downloads/%(title)s.%(ext)s" "TAUTAN_VIDEO"',
      downloadNote: 'Untuk MP4 biasa, paket ini umumnya sudah cukup.',
      note: '<strong>Catatan:</strong> ffmpeg-free memiliki codec lebih terbatas. Bila konversi MP3 tertentu gagal, gunakan build FFmpeg lengkap yang sesuai dengan Fedora.'
    },
    arch: {
      icon: 'A', kicker: 'Linux berbasis Arch', title: 'Arch, Manjaro, EndeavourOS, Garuda, dan CachyOS', status: 'Pacman', shell: 'Terminal',
      description: 'Paket yt-dlp dan FFmpeg tersedia dari repositori Arch dan dipasang bersama pembaruan sistem.',
      openTitle: 'Buka Terminal', openText: 'Buka Konsole, GNOME Terminal, Kitty, atau terminal bawaan distro.',
      installNote: 'Perbarui sistem dan pasang kedua paket.',
      install: 'sudo pacman -Syu --needed yt-dlp ffmpeg',
      check: 'yt-dlp --version\nffmpeg -version',
      download: 'yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -o "$HOME/Downloads/%(title)s.%(ext)s" "TAUTAN_VIDEO"',
      downloadNote: 'Hasil akan masuk ke Downloads.',
      note: '<strong>Tips:</strong> jangan melakukan partial upgrade pada Arch. Biarkan perintah <code>-Syu</code> memperbarui sistem terlebih dahulu.'
    },
    opensuse: {
      icon: 'S', kicker: 'Linux', title: 'openSUSE Tumbleweed dan Leap', status: 'Zypper', shell: 'Terminal',
      description: 'Tumbleweed biasanya memiliki paket lebih baru. Pada Leap, paket yt-dlp atau FFmpeg dapat membutuhkan repositori tambahan.',
      openTitle: 'Buka Terminal', openText: 'Cari Konsole atau Terminal dari menu aplikasi.',
      installNote: 'Coba paket resmi terlebih dahulu.',
      install: 'sudo zypper refresh\nsudo zypper install yt-dlp ffmpeg',
      check: 'yt-dlp --version\nffmpeg -version',
      download: 'yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -o "$HOME/Downloads/%(title)s.%(ext)s" "TAUTAN_VIDEO"',
      downloadNote: 'Gunakan folder Downloads agar mudah ditemukan.',
      note: '<strong>Bila paket tidak ditemukan:</strong> pilih “Linux distro lainnya” untuk yt-dlp, lalu pasang FFmpeg melalui YaST Software atau repositori multimedia yang kamu percaya.'
    },
    alpine: {
      icon: 'Al', kicker: 'Linux ringan', title: 'Alpine Linux dan postmarketOS', status: 'APK', shell: 'Terminal',
      description: 'Alpine memakai package manager APK. Pada postmarketOS, sudo dapat digunakan sebagai pengganti doas.',
      openTitle: 'Buka Terminal', openText: 'Masuk ke shell Alpine atau buka terminal pada postmarketOS.',
      installNote: 'Pasang yt-dlp dan FFmpeg dari repositori community.',
      install: 'doas apk update\ndoas apk add yt-dlp ffmpeg',
      check: 'yt-dlp --version\nffmpeg -version',
      download: 'yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -o "$HOME/Downloads/%(title)s.%(ext)s" "TAUTAN_VIDEO"',
      downloadNote: 'Buat folder Downloads bila belum ada: mkdir -p "$HOME/Downloads".',
      note: '<strong>postmarketOS:</strong> bila <code>doas</code> tidak tersedia, ganti dengan <code>sudo</code>.'
    },
    'universal-linux': {
      icon: '∞', kicker: 'Linux universal', title: 'Linux distro lainnya', status: 'Cara universal', shell: 'Terminal',
      description: 'Gunakan binary resmi yt-dlp di folder pengguna. Cara ini tidak mengubah file sistem utama dan cocok untuk banyak distro.',
      openTitle: 'Buka Terminal', openText: 'Gunakan terminal bawaan distro. Pastikan curl dan FFmpeg tersedia.',
      installNote: 'Perintah ini memasang yt-dlp ke ~/.local/bin. FFmpeg tetap perlu dipasang dari package manager distro.',
      install: 'mkdir -p "$HOME/.local/bin"\ncurl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o "$HOME/.local/bin/yt-dlp"\nchmod a+rx "$HOME/.local/bin/yt-dlp"\necho \'export PATH="$HOME/.local/bin:$PATH"\' >> "$HOME/.profile"\nexport PATH="$HOME/.local/bin:$PATH"',
      check: 'yt-dlp --version\nffmpeg -version',
      download: 'yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -o "$HOME/Downloads/%(title)s.%(ext)s" "TAUTAN_VIDEO"',
      downloadNote: 'Buat folder Downloads jika belum ada.',
      note: '<strong>Perlu Python:</strong> binary universal <code>yt-dlp</code> membutuhkan Python yang didukung. Untuk PC x86_64 tanpa Python, unduh binary <code>yt-dlp_linux</code> dari rilis resmi.'
    },
    macos: {
      icon: 'M', kicker: 'Komputer Apple', title: 'macOS', status: 'Homebrew', shell: 'Terminal',
      description: 'Homebrew memasang yt-dlp dan FFmpeg sekaligus dan memudahkan pembaruan.',
      openTitle: 'Buka Terminal', openText: 'Buka Spotlight dengan Command + Space, ketik Terminal, lalu tekan Enter.',
      installNote: 'Pastikan Homebrew sudah terpasang, lalu jalankan satu baris ini.',
      install: 'brew install yt-dlp ffmpeg',
      check: 'yt-dlp --version\nffmpeg -version',
      download: 'yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -o "$HOME/Downloads/%(title)s.%(ext)s" "TAUTAN_VIDEO"',
      downloadNote: 'Hasil akan muncul di folder Downloads.',
      note: '<strong>Belum punya Homebrew?</strong> Pasang dari situs resmi Homebrew, lalu buka ulang Terminal.'
    },
    android: {
      icon: 'An', kicker: 'HP dan tablet', title: 'Android lewat Termux', status: 'APK langsung', shell: 'Termux',
      description: 'Termux membuat lingkungan terminal ringan di Android. File hasil unduhan masuk ke folder Download HP.',
      openTitle: 'Unduh dan buka Termux', openText: 'Gunakan tombol APK langsung di bawah panduan ini. Setelah instal, buka Termux.',
      installNote: 'Izinkan penyimpanan, perbarui paket, lalu pasang Python, FFmpeg, dan yt-dlp.',
      install: 'termux-setup-storage\npkg update -y && pkg upgrade -y\npkg install -y python ffmpeg\npython -m pip install -U "yt-dlp[default]"',
      check: 'yt-dlp --version\nffmpeg -version',
      download: 'yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -P "/sdcard/Download" "TAUTAN_VIDEO"',
      downloadNote: 'Saat muncul permintaan izin penyimpanan, tekan Izinkan.',
      note: '<strong>Android 12 ke atas:</strong> sistem dapat menghentikan proses yang terlalu berat. Biarkan Termux tetap terbuka selama unduhan.',
      action: '<a class="button primary guide-extra-button" href="https://f-droid.org/repo/com.termux_1022.apk" target="_blank" rel="noopener noreferrer" download>Unduh Termux APK</a>'
    },
    chromeos: {
      icon: 'C', kicker: 'Chromebook', title: 'ChromeOS / Chromebook', status: 'Linux Debian', shell: 'Terminal Linux',
      description: 'Aktifkan Linux Development Environment di Pengaturan ChromeOS. Lingkungannya berbasis Debian.',
      openTitle: 'Aktifkan Linux Development Environment', openText: 'Buka Settings → About ChromeOS → Developers → Linux development environment, lalu pilih Turn on.',
      installNote: 'Setelah aplikasi Terminal Linux terbuka, gunakan APT.',
      install: 'sudo apt update\nsudo apt install -y yt-dlp ffmpeg',
      check: 'yt-dlp --version\nffmpeg -version',
      download: 'yt-dlp -f "bv*+ba/b" --merge-output-format mp4 -o "$HOME/Downloads/%(title)s.%(ext)s" "TAUTAN_VIDEO"',
      downloadNote: 'Folder Linux terpisah dari Downloads ChromeOS. Pindahkan file melalui aplikasi Files bila perlu.',
      note: '<strong>Chromebook sekolah/kantor:</strong> administrator dapat menonaktifkan Linux. Dalam kondisi itu gunakan pilihan web.'
    },
    steamdeck: {
      icon: 'SD', kicker: 'Konsol Linux', title: 'Steam Deck / SteamOS', status: 'Desktop Mode', shell: 'Konsole',
      description: 'SteamOS berbasis Arch, tetapi sistemnya bersifat read-only. Perubahan paket sistem dapat hilang setelah pembaruan besar.',
      openTitle: 'Masuk ke Desktop Mode', openText: 'Tekan Steam → Power → Switch to Desktop, lalu buka Konsole.',
      installNote: 'Cara paling mudah adalah memakai pipx untuk yt-dlp. FFmpeg biasanya sudah tersedia; cek lebih dulu.',
      install: 'python3 -m ensurepip --user\npython3 -m pip install --user -U "yt-dlp[default]"',
      check: 'python3 -m yt_dlp --version\nffmpeg -version',
      download: 'python3 -m yt_dlp -f "bv*+ba/b" --merge-output-format mp4 -o "$HOME/Downloads/%(title)s.%(ext)s" "TAUTAN_VIDEO"',
      downloadNote: 'Perintah memakai python3 -m yt_dlp agar tetap terbaca tanpa mengubah PATH.',
      note: '<strong>Alternatif:</strong> bila Python atau FFmpeg tidak tersedia, gunakan pilihan web melalui browser Desktop Mode.'
    },
    ios: {
      icon: 'i', kicker: 'HP dan tablet Apple', title: 'iPhone dan iPad', status: 'Tanpa terminal', shell: 'Safari',
      description: 'iOS tidak memiliki cara yt-dlp + FFmpeg yang sesederhana Windows, Linux, macOS, atau Android tanpa aplikasi dan pengaturan tambahan.',
      openTitle: 'Buka Safari', openText: 'Gunakan salah satu pilihan web pada bagian berikutnya.',
      installNote: 'Tidak perlu memasang yt-dlp. Pilih web sesuai kebutuhan.',
      install: 'YT1s: khusus MP4\nnoTube: pilihan cadangan\nCobalt: TikTok dan media sosial',
      check: 'Tidak ada perintah yang perlu diperiksa.',
      download: 'Buka bagian “Pilihan web” lalu pilih layanan yang sesuai.',
      downloadNote: 'Simpan hasil ke aplikasi Files saat Safari menampilkan pilihan unduhan.',
      note: '<strong>Keamanan:</strong> jangan memasukkan Apple ID, kata sandi, kode OTP, atau cookies ke situs pihak ketiga.',
      action: '<a class="button secondary guide-extra-button" href="#pilihan-web">Buka pilihan web</a>'
    }
  };

  const guidePanel = document.getElementById('guidePanel');
  const guideFields = {
    icon: document.getElementById('guideIcon'), kicker: document.getElementById('guideKicker'), title: document.getElementById('guideTitle'),
    description: document.getElementById('guideDescription'), status: document.getElementById('guideStatus'), stepOneTitle: document.getElementById('guideStepOneTitle'),
    stepOneText: document.getElementById('guideStepOneText'), installNote: document.getElementById('guideInstallNote'), shellLabel: document.getElementById('guideShellLabel'),
    installCode: document.getElementById('guideInstallCode'), checkCode: document.getElementById('guideCheckCode'), downloadCode: document.getElementById('guideDownloadCode'),
    downloadNote: document.getElementById('guideDownloadNote'), note: document.getElementById('guideNote'), extraAction: document.getElementById('guideExtraAction')
  };

  const openGuide = (key, shouldScroll = false) => {
    const guide = guides[key];
    if (!guide) return;
    document.querySelectorAll('.device-card').forEach((card) => card.classList.toggle('active', card.dataset.guide === key));
    guideFields.icon.textContent = guide.icon;
    guideFields.kicker.textContent = guide.kicker;
    guideFields.title.textContent = guide.title;
    guideFields.description.textContent = guide.description;
    guideFields.status.textContent = guide.status;
    guideFields.stepOneTitle.textContent = guide.openTitle;
    guideFields.stepOneText.textContent = guide.openText;
    guideFields.installNote.textContent = guide.installNote;
    guideFields.shellLabel.textContent = guide.shell;
    guideFields.installCode.textContent = guide.install;
    guideFields.checkCode.textContent = guide.check;
    guideFields.downloadCode.textContent = guide.download;
    guideFields.downloadNote.textContent = guide.downloadNote;
    guideFields.note.innerHTML = guide.note;
    guideFields.extraAction.innerHTML = guide.action || '';
    localStorage.setItem('yt-conv-support-guide', key);
    if (shouldScroll) guidePanel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  document.querySelectorAll('.device-card').forEach((card) => card.addEventListener('click', () => openGuide(card.dataset.guide, true)));
  const savedGuide = localStorage.getItem('yt-conv-support-guide');
  openGuide(savedGuide && guides[savedGuide] ? savedGuide : 'windows');

  const deviceSearch = document.getElementById('deviceSearch');
  const deviceCards = [...document.querySelectorAll('.device-card')];
  const deviceEmpty = document.getElementById('deviceEmpty');
  let deviceFilter = 'all';

  const filterDevices = () => {
    const query = (deviceSearch?.value || '').trim().toLowerCase();
    let visible = 0;
    deviceCards.forEach((card) => {
      const categories = (card.dataset.category || '').split(' ');
      const categoryMatch = deviceFilter === 'all' || categories.includes(deviceFilter);
      const haystack = `${card.textContent} ${card.dataset.keywords || ''}`.toLowerCase();
      const textMatch = !query || haystack.includes(query);
      card.hidden = !(categoryMatch && textMatch);
      if (!card.hidden) visible += 1;
    });
    if (deviceEmpty) deviceEmpty.hidden = visible !== 0;
  };
  deviceSearch?.addEventListener('input', filterDevices);
  document.querySelectorAll('.filter-chip').forEach((chip) => chip.addEventListener('click', () => {
    deviceFilter = chip.dataset.filter || 'all';
    document.querySelectorAll('.filter-chip').forEach((item) => item.classList.toggle('active', item === chip));
    filterDevices();
  }));

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-open-guide]');
    if (!trigger) return;
    const key = trigger.dataset.openGuide;
    setTimeout(() => openGuide(key, true), 50);
  });

  installHelpLink?.addEventListener('click', () => {
    const key = installHelpLink.dataset.targetGuide || 'windows';
    setTimeout(() => openGuide(key, true), 50);
  });

  document.querySelectorAll('[data-jump-platform]').forEach((link) => link.addEventListener('click', () => selectBuilderPlatform(link.dataset.jumpPlatform || 'windows')));

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
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`));
    }, { rootMargin: '-18% 0px -67% 0px', threshold: [0,.1,.3] });
    sections.forEach((section) => observer.observe(section));
  }

  const backTop = document.getElementById('backTop');
  window.addEventListener('scroll', () => backTop?.classList.toggle('show', window.scrollY > 700), { passive: true });
  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();
