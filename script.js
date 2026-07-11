'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

const storage = {
  get(key){ try { return localStorage.getItem(key); } catch { return null; } },
  set(key,value){ try { localStorage.setItem(key,value); } catch {} },
  remove(key){ try { localStorage.removeItem(key); } catch {} }
};

const PATHS = {
  windows: '"%USERPROFILE%\\Downloads"',
  unix: '"$HOME/Downloads"',
  android: '"$HOME/storage/downloads"',
  chromeos: '"/mnt/chromeos/MyFiles/Downloads"'
};

const commonVerify = ['yt-dlp --version', 'ffmpeg -version', 'deno --version'].join('\n');
const linuxBinaryInstall = [
  'sudo mkdir -p /usr/local/bin',
  'sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp',
  'sudo chmod a+rx /usr/local/bin/yt-dlp'
].join('\n');
const denoLinuxInstall = 'curl -fsSL https://deno.land/install.sh | sh';

const guideData = [
  {
    id:'windows', title:'Windows 10/11', short:'CMD, PowerShell, Terminal', family:'Komputer', category:['desktop'], icon:'W', tags:'windows win10 win11 cmd powershell winget laptop pc',
    intro:'Cara termudah pakai Windows Terminal atau PowerShell.', status:'Paling mudah', summary:['yt-dlp','FFmpeg','Deno','Folder Downloads'], path:PATHS.windows, commandLabel:'Windows Terminal', runtime:'--remote-components ejs:github', cookieFile:'"%USERPROFILE%\\Downloads\\cookies.txt"',
    steps:[
      {title:'Buka Terminal sebagai admin', short:'Klik kanan Start → Terminal (Admin)', text:'Tekan Start, cari “Terminal”, lalu pilih Run as administrator. CMD atau PowerShell juga boleh.', code:''},
      {title:'Pasang 3 bahan', short:'yt-dlp, FFmpeg, dan Deno', text:'Salin satu per satu. Kalau diminta konfirmasi, tekan Y.', code:['winget install yt-dlp','winget install Gyan.FFmpeg','winget install DenoLand.Deno'].join('\n'), label:'PowerShell / CMD'},
      {title:'Tutup lalu buka Terminal lagi', short:'Supaya PATH terbaca', text:'Ini penting. Setelah dibuka ulang, cek ketiganya.', code:commonVerify, label:'Tes instalasi'},
      {title:'Tes unduh MP4', short:'Hasil masuk Downloads', text:'Ganti TAUTAN_VIDEO dengan link video milikmu.', code:'yt-dlp --remote-components ejs:github -f "bv*+ba/b" --merge-output-format mp4 -P "%USERPROFILE%\\Downloads" "TAUTAN_VIDEO"', label:'MP4'},
      {title:'Kalau YouTube baru berubah', short:'Update dulu', text:'Coba update biasa. Kalau extractor masih error, pindah ke versi nightly.', code:['winget upgrade yt-dlp','yt-dlp --update-to nightly'].join('\n'), label:'Update'}
    ],
    footer:'Kalau winget tidak menemukan paket, jalankan winget search yt-dlp atau perbarui App Installer dari Microsoft Store.'
  },
  {
    id:'android', title:'Android + Termux', short:'HP dan tablet Android', family:'HP / tablet', category:['mobile'], icon:'A', tags:'android termux hp smartphone tablet samsung xiaomi oppo vivo realme',
    intro:'Pakai Termux. Tidak perlu root.', status:'Android', summary:['Termux','Python','FFmpeg','Deno'], path:PATHS.android, commandLabel:'Termux', runtime:'--remote-components ejs:github', cookieFile:'"$HOME/storage/downloads/cookies.txt"',
    steps:[
      {title:'Unduh Termux', short:'Pakai APK yang disediakan', text:'Pasang APK, lalu buka Termux. Android mungkin meminta izin instalasi dari browser.', html:'<a class="button primary" href="https://f-droid.org/repo/com.termux_1022.apk" target="_blank" rel="noopener noreferrer">Unduh Termux APK</a>'},
      {title:'Izinkan penyimpanan', short:'Pilih Izinkan saat muncul', text:'Perintah ini membuat jalur ke Penyimpanan internal → Download.', code:'termux-setup-storage', label:'Termux'},
      {title:'Perbarui paket', short:'Biar daftar paket tidak basi', text:'Biarkan sampai selesai. Tekan Y kalau diminta.', code:'pkg update && pkg upgrade -y', label:'Termux'},
      {title:'Pasang bahan', short:'Python, FFmpeg, Deno, lalu yt-dlp', text:'Jalankan dua baris ini. yt-dlp dipasang lewat pip resmi.', code:['pkg install python python-pip ffmpeg deno -y','python -m pip install -U "yt-dlp[default]"'].join('\n'), label:'Termux'},
      {title:'Cek instalasi', short:'Harus muncul nomor versi', text:'Kalau tiga-tiganya menampilkan versi, berarti sudah siap.', code:commonVerify, label:'Tes'},
      {title:'Tes MP4', short:'Masuk Penyimpanan internal → Download', text:'Tulisan storage/downloads adalah folder Download internal, bukan kartu SD fisik.', code:'yt-dlp --remote-components ejs:github -f "bv*+ba/b" --merge-output-format mp4 -P "$HOME/storage/downloads" "TAUTAN_VIDEO"', label:'MP4'},
      {title:'Update nanti', short:'Kalau mulai error', text:'Perbarui yt-dlp dan paket Termux.', code:['python -m pip install -U "yt-dlp[default]"','pkg upgrade -y'].join('\n'), label:'Update'}
    ],
    footer:'Chrome Android tidak bisa dibaca langsung oleh Termux. Kalau video minta login, ekspor cookies.txt lalu taruh di folder Download.'
  },
  {
    id:'ubuntu', title:'Ubuntu / Debian', short:'Mint, Pop!_OS, Zorin, Kali', family:'Linux', category:['desktop','linux'], icon:'U', tags:'ubuntu debian mint linuxmint pop os zorin kali raspberry pi apt wsl',
    intro:'Cocok untuk distro keluarga Debian dan Ubuntu.', status:'APT', summary:['APT','Binary resmi','FFmpeg','Deno'], path:PATHS.unix, commandLabel:'Terminal Linux', runtime:'--remote-components ejs:github', cookieFile:'"$HOME/Downloads/cookies.txt"',
    steps:[
      {title:'Buka Terminal', short:'Ctrl + Alt + T', text:'Pastikan akunmu bisa memakai sudo.', code:''},
      {title:'Pasang curl dan FFmpeg', short:'Dari repo distro', text:'Masukkan password Linux saat diminta. Tulisan password memang tidak terlihat.', code:'sudo apt update && sudo apt install -y curl ffmpeg', label:'Terminal'},
      {title:'Pasang yt-dlp resmi', short:'Biar tidak tertinggal versi repo', text:'Perintah ini mengambil binary terbaru langsung dari rilis resmi yt-dlp.', code:linuxBinaryInstall, label:'Terminal'},
      {title:'Pasang Deno', short:'Runtime JavaScript untuk YouTube terbaru', text:'Setelah selesai, tutup Terminal lalu buka lagi.', code:denoLinuxInstall, label:'Terminal'},
      {title:'Cek semuanya', short:'Harus muncul versi', text:'Kalau deno belum dikenali, tutup sesi lalu login ulang.', code:commonVerify, label:'Tes'},
      {title:'Tes MP4', short:'Masuk folder Downloads', text:'Ganti link contoh dengan tautan videomu.', code:'yt-dlp --remote-components ejs:github -f "bv*+ba/b" --merge-output-format mp4 -P "$HOME/Downloads" "TAUTAN_VIDEO"', label:'MP4'},
      {title:'Update yt-dlp', short:'Jalankan kalau extractor error', text:'Binary resmi bisa memperbarui dirinya sendiri.', code:'sudo yt-dlp -U', label:'Update'}
    ], footer:'Untuk WSL, hasil di $HOME/Downloads berada di Linux. Kalau ingin folder Windows, ganti tujuan ke /mnt/c/Users/NAMA_KAMU/Downloads.'
  },
  {
    id:'fedora', title:'Fedora', short:'Fedora Workstation / Spins', family:'Linux', category:['desktop','linux'], icon:'F', tags:'fedora dnf workstation spin nobara rhel',
    intro:'Pakai DNF untuk bahan dasar dan binary resmi yt-dlp.', status:'DNF', summary:['DNF','ffmpeg-free','Binary resmi','Deno'], path:PATHS.unix, commandLabel:'Terminal Fedora', runtime:'--remote-components ejs:github', cookieFile:'"$HOME/Downloads/cookies.txt"',
    steps:[
      {title:'Pasang bahan dasar', short:'curl dan FFmpeg', text:'ffmpeg-free cukup untuk menggabungkan kebanyakan hasil unduhan.', code:'sudo dnf install -y curl ffmpeg-free', label:'Terminal'},
      {title:'Pasang yt-dlp resmi', short:'Langsung dari GitHub resmi', text:'Cara ini biasanya lebih baru daripada paket distro.', code:linuxBinaryInstall, label:'Terminal'},
      {title:'Pasang Deno', short:'Lalu buka ulang Terminal', text:'Deno membantu challenge JavaScript YouTube.', code:denoLinuxInstall, label:'Terminal'},
      {title:'Cek dan tes', short:'Pastikan versi muncul', text:'Lanjut tes MP4 setelah semuanya terbaca.', code:commonVerify+'\n\nyt-dlp --remote-components ejs:github -f "bv*+ba/b" --merge-output-format mp4 -P "$HOME/Downloads" "TAUTAN_VIDEO"', label:'Tes'},
      {title:'Update', short:'Saat mulai error', text:'Perbarui yt-dlp resmi.', code:'sudo yt-dlp -U', label:'Update'}
    ], footer:'Kalau format tertentu gagal diproses, Fedora pengguna RPM Fusion bisa memakai FFmpeg lengkap sesuai kebijakan sistem masing-masing.'
  },
  {
    id:'arch', title:'Arch / Manjaro', short:'EndeavourOS, Garuda, CachyOS', family:'Linux', category:['desktop','linux'], icon:'AR', tags:'arch manjaro endeavouros garuda cachyos pacman',
    intro:'Semua bahan tersedia lewat pacman.', status:'Pacman', summary:['Pacman','yt-dlp','FFmpeg','Deno'], path:PATHS.unix, commandLabel:'Terminal Arch', runtime:'--remote-components ejs:github', cookieFile:'"$HOME/Downloads/cookies.txt"',
    steps:[
      {title:'Perbarui sistem dan pasang bahan', short:'Satu perintah', text:'Jangan jalankan partial upgrade di Arch.', code:'sudo pacman -Syu --needed yt-dlp ffmpeg deno', label:'Terminal'},
      {title:'Cek instalasi', short:'Pastikan muncul versi', text:'Kalau selesai tanpa error, tes ketiganya.', code:commonVerify, label:'Tes'},
      {title:'Tes MP4', short:'Masuk Downloads', text:'Ganti TAUTAN_VIDEO.', code:'yt-dlp --remote-components ejs:github -f "bv*+ba/b" --merge-output-format mp4 -P "$HOME/Downloads" "TAUTAN_VIDEO"', label:'MP4'},
      {title:'Update', short:'Ikuti update sistem', text:'Di keluarga Arch, update paket lewat pacman.', code:'sudo pacman -Syu', label:'Update'}
    ], footer:'Manjaro kadang menahan versi paket sedikit lebih lama. Kalau YouTube berubah duluan, tunggu update repo atau gunakan binary resmi.'
  },
  {
    id:'opensuse', title:'openSUSE', short:'Tumbleweed dan Leap', family:'Linux', category:['desktop','linux'], icon:'S', tags:'opensuse suse tumbleweed leap zypper',
    intro:'Pakai zypper untuk bahan dasar.', status:'Zypper', summary:['Zypper','Binary resmi','FFmpeg','Deno'], path:PATHS.unix, commandLabel:'Terminal openSUSE', runtime:'--remote-components ejs:github', cookieFile:'"$HOME/Downloads/cookies.txt"',
    steps:[
      {title:'Pasang curl dan FFmpeg', short:'Lewat zypper', text:'Refresh repo lalu pasang bahan.', code:'sudo zypper refresh\nsudo zypper install -y curl ffmpeg', label:'Terminal'},
      {title:'Pasang yt-dlp resmi', short:'Binary terbaru', text:'Ambil dari rilis resmi.', code:linuxBinaryInstall, label:'Terminal'},
      {title:'Pasang Deno', short:'Buka ulang terminal setelahnya', text:'Jalankan installer resmi.', code:denoLinuxInstall, label:'Terminal'},
      {title:'Cek dan tes MP4', short:'Pastikan semuanya jalan', text:'Ganti link contoh.', code:commonVerify+'\n\nyt-dlp --remote-components ejs:github -f "bv*+ba/b" --merge-output-format mp4 -P "$HOME/Downloads" "TAUTAN_VIDEO"', label:'Tes'}
    ], footer:'Ketersediaan codec FFmpeg bisa berbeda sesuai repo openSUSE yang aktif.'
  },
  {
    id:'alpine', title:'Alpine Linux', short:'Termasuk postmarketOS', family:'Linux', category:['desktop','linux','mobile'], icon:'AL', tags:'alpine postmarketos apk node nodejs',
    intro:'Pakai Node.js sebagai runtime karena lebih cocok dengan paket Alpine.', status:'APK', summary:['APK','yt-dlp','FFmpeg','Node.js 22+'], path:PATHS.unix, commandLabel:'Terminal Alpine', runtime:'--js-runtimes node --remote-components ejs:npm', cookieFile:'"$HOME/Downloads/cookies.txt"',
    steps:[
      {title:'Pasang semua paket', short:'Lewat APK', text:'Kalau sistemmu tidak punya sudo, gunakan doas.', code:'doas apk update\ndoas apk add yt-dlp ffmpeg nodejs npm', label:'Terminal'},
      {title:'Cek versi', short:'Node.js minimal versi 22', text:'Kalau Node masih lama, update Alpine lebih dulu.', code:'yt-dlp --version\nffmpeg -version\nnode --version', label:'Tes'},
      {title:'Tes MP4', short:'Runtime Node dipilih manual', text:'Command Alpine sedikit berbeda.', code:'yt-dlp --js-runtimes node --remote-components ejs:npm -f "bv*+ba/b" --merge-output-format mp4 -P "$HOME/Downloads" "TAUTAN_VIDEO"', label:'MP4'},
      {title:'Update', short:'Lewat APK', text:'Perbarui paket sistem.', code:'doas apk upgrade', label:'Update'}
    ], footer:'postmarketOS berbasis Alpine. Lokasi folder unduhan bisa berbeda menurut antarmuka yang dipakai.'
  },
  {
    id:'macos', title:'macOS', short:'Mac Intel dan Apple Silicon', family:'Komputer', category:['desktop'], icon:'M', tags:'macos mac apple intel silicon homebrew brew',
    intro:'Paling gampang melalui Homebrew.', status:'Homebrew', summary:['Homebrew','yt-dlp','FFmpeg','Deno'], path:PATHS.unix, commandLabel:'Terminal macOS', runtime:'--remote-components ejs:github', cookieFile:'"$HOME/Downloads/cookies.txt"',
    steps:[
      {title:'Cek Homebrew', short:'Pasang kalau belum ada', text:'Jalankan brew --version. Kalau tidak dikenali, pasang Homebrew.', code:'/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"', label:'Pasang Homebrew'},
      {title:'Pasang semua bahan', short:'Satu perintah', text:'Homebrew mengurus yt-dlp, FFmpeg, dan Deno.', code:'brew install yt-dlp ffmpeg deno', label:'Terminal'},
      {title:'Cek instalasi', short:'Pastikan nomor versi muncul', text:'Buka ulang Terminal kalau belum terbaca.', code:commonVerify, label:'Tes'},
      {title:'Tes MP4', short:'Masuk Downloads', text:'Ganti link contoh.', code:'yt-dlp --remote-components ejs:github -f "bv*+ba/b" --merge-output-format mp4 -P "$HOME/Downloads" "TAUTAN_VIDEO"', label:'MP4'},
      {title:'Update', short:'Lewat Homebrew', text:'Perbarui daftar dan paket.', code:'brew update && brew upgrade yt-dlp ffmpeg deno', label:'Update'}
    ], footer:'Kalau macOS meminta izin akses folder Downloads, pilih Allow.'
  },
  {
    id:'chromeos', title:'ChromeOS / Chromebook', short:'Pakai Linux Development Environment', family:'Komputer', category:['desktop','linux'], icon:'C', tags:'chromeos chromebook crostini linux development environment',
    intro:'Aktifkan Linux bawaan Chromebook, lalu ikuti langkah Debian.', status:'Crostini', summary:['Linux aktif','APT','FFmpeg','Deno'], path:PATHS.chromeos, commandLabel:'Terminal Chromebook', runtime:'--remote-components ejs:github', cookieFile:'"/mnt/chromeos/MyFiles/Downloads/cookies.txt"',
    steps:[
      {title:'Aktifkan Linux', short:'Settings → About ChromeOS → Developers', text:'Pilih Linux development environment lalu Set up. Tunggu Terminal Linux terbuka.', code:''},
      {title:'Bagikan folder Downloads', short:'Agar Linux bisa menyimpan ke sana', text:'Di aplikasi Files, klik kanan Downloads lalu pilih Share with Linux.', code:''},
      {title:'Pasang bahan', short:'Sama seperti Debian', text:'Pasang curl dan FFmpeg, lalu yt-dlp resmi.', code:'sudo apt update && sudo apt install -y curl ffmpeg\n'+linuxBinaryInstall, label:'Terminal'},
      {title:'Pasang Deno', short:'Buka ulang Terminal', text:'Jalankan installer resmi.', code:denoLinuxInstall, label:'Terminal'},
      {title:'Cek dan tes MP4', short:'Hasil masuk My files → Downloads', text:'Gunakan path ChromeOS.', code:commonVerify+'\n\nyt-dlp --remote-components ejs:github -f "bv*+ba/b" --merge-output-format mp4 -P "/mnt/chromeos/MyFiles/Downloads" "TAUTAN_VIDEO"', label:'Tes'}
    ], footer:'Chromebook sekolah atau kantor bisa menonaktifkan Linux. Kalau menunya tidak ada, gunakan pilihan web tanpa instalasi.'
  },
  {
    id:'steamos', title:'Steam Deck / SteamOS', short:'Desktop Mode', family:'Linux', category:['desktop','linux'], icon:'SD', tags:'steam deck steamos desktop mode immutable arch',
    intro:'Gunakan Desktop Mode dan simpan yt-dlp di folder pengguna.', status:'SteamOS', summary:['Desktop Mode','Binary pengguna','FFmpeg','Deno'], path:PATHS.unix, commandLabel:'Konsole SteamOS', runtime:'--remote-components ejs:github', cookieFile:'"$HOME/Downloads/cookies.txt"',
    steps:[
      {title:'Masuk Desktop Mode', short:'Power → Switch to Desktop', text:'Buka Konsole dari menu aplikasi.', code:''},
      {title:'Pasang yt-dlp di akunmu', short:'Tidak mengubah sistem read-only', text:'Simpan binary ke ~/.local/bin.', code:'mkdir -p "$HOME/.local/bin"\ncurl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o "$HOME/.local/bin/yt-dlp"\nchmod +x "$HOME/.local/bin/yt-dlp"\necho \'export PATH="$HOME/.local/bin:$PATH"\' >> "$HOME/.bashrc"', label:'Konsole'},
      {title:'Pasang Deno', short:'Lalu buka ulang Konsole', text:'FFmpeg biasanya sudah ada di SteamOS; cek dulu.', code:denoLinuxInstall+'\nffmpeg -version', label:'Konsole'},
      {title:'Cek dan tes', short:'Masuk Downloads', text:'Kalau ffmpeg tidak ditemukan, pilihan paling aman adalah Flatpak atau distrobox yang sudah kamu gunakan.', code:commonVerify+'\n\nyt-dlp --remote-components ejs:github -f "bv*+ba/b" --merge-output-format mp4 -P "$HOME/Downloads" "TAUTAN_VIDEO"', label:'Tes'}
    ], footer:'Update SteamOS bisa menghapus perubahan pada partisi sistem. Karena itu panduan ini menyimpan yt-dlp di folder pengguna.'
  },
  {
    id:'nixos', title:'NixOS', short:'Nix profile atau shell', family:'Linux', category:['desktop','linux'], icon:'N', tags:'nixos nix profile flakes',
    intro:'Pasang ketiga alat ke profile pengguna.', status:'Nix', summary:['Nix','yt-dlp','FFmpeg','Deno'], path:PATHS.unix, commandLabel:'Terminal NixOS', runtime:'--remote-components ejs:github', cookieFile:'"$HOME/Downloads/cookies.txt"',
    steps:[
      {title:'Pasang paket', short:'Ke profile pengguna', text:'Tidak perlu mengubah configuration.nix untuk tes cepat.', code:'nix profile install nixpkgs#yt-dlp nixpkgs#ffmpeg nixpkgs#deno', label:'Terminal'},
      {title:'Cek dan tes', short:'Pastikan semuanya terbaca', text:'Ganti link contoh.', code:commonVerify+'\n\nyt-dlp --remote-components ejs:github -f "bv*+ba/b" --merge-output-format mp4 -P "$HOME/Downloads" "TAUTAN_VIDEO"', label:'Tes'},
      {title:'Update', short:'Perbarui profile', text:'Upgrade paket profile.', code:'nix profile upgrade --all', label:'Update'}
    ], footer:'Untuk pemasangan permanen sistem, tambahkan yt-dlp, ffmpeg, dan deno ke environment.systemPackages.'
  },
  {
    id:'void', title:'Void Linux', short:'XBPS', family:'Linux', category:['desktop','linux'], icon:'V', tags:'void xbps xbps-install',
    intro:'Pakai XBPS untuk paket yang tersedia.', status:'XBPS', summary:['XBPS','yt-dlp','FFmpeg','Deno'], path:PATHS.unix, commandLabel:'Terminal Void', runtime:'--remote-components ejs:github', cookieFile:'"$HOME/Downloads/cookies.txt"',
    steps:[
      {title:'Sinkronkan dan pasang', short:'Lewat XBPS', text:'Pasang seluruh bahan.', code:'sudo xbps-install -Suy\nsudo xbps-install -y yt-dlp ffmpeg deno', label:'Terminal'},
      {title:'Cek dan tes', short:'Pastikan versi muncul', text:'Ganti link contoh.', code:commonVerify+'\n\nyt-dlp --remote-components ejs:github -f "bv*+ba/b" --merge-output-format mp4 -P "$HOME/Downloads" "TAUTAN_VIDEO"', label:'Tes'}
    ], footer:'Kalau paket Deno tidak tersedia di cabang repo-mu, gunakan installer resmi Deno.'
  },
  {
    id:'linux-other', title:'Linux lainnya', short:'Solus, Gentoo, Puppy, dll.', family:'Linux', category:['desktop','linux'], icon:'L', tags:'linux other generic solus gentoo puppy slackware clear linux',
    intro:'Pakai binary resmi yt-dlp, lalu pasang FFmpeg dari pengelola paket distro.', status:'Universal', summary:['Binary resmi','FFmpeg distro','Deno'], path:PATHS.unix, commandLabel:'Terminal Linux', runtime:'--remote-components ejs:github', cookieFile:'"$HOME/Downloads/cookies.txt"',
    steps:[
      {title:'Pasang curl dan FFmpeg', short:'Nama command tergantung distro', text:'Cari paket bernama curl dan ffmpeg di software manager atau package manager distro.', code:''},
      {title:'Pasang yt-dlp resmi', short:'Cara universal Linux', text:'Jalankan dengan sudo.', code:linuxBinaryInstall, label:'Terminal'},
      {title:'Pasang Deno', short:'Installer resmi', text:'Tutup Terminal setelah selesai, lalu buka lagi.', code:denoLinuxInstall, label:'Terminal'},
      {title:'Cek dan tes', short:'Pastikan ketiganya jalan', text:'Ganti link contoh.', code:commonVerify+'\n\nyt-dlp --remote-components ejs:github -f "bv*+ba/b" --merge-output-format mp4 -P "$HOME/Downloads" "TAUTAN_VIDEO"', label:'Tes'}
    ], footer:'Kalau distro sangat lama, Python atau glibc bisa tidak memenuhi syarat. Gunakan pilihan web sebagai jalan cepat.'
  },
  {
    id:'ios', title:'iPhone / iPad', short:'Tanpa terminal resmi', family:'HP / tablet', category:['mobile'], icon:'i', tags:'iphone ipad ios ipados safari apple mobile',
    intro:'Tidak ada alur yt-dlp terminal yang sederhana dan resmi untuk pengguna umum.', status:'Gunakan web', summary:['Safari','Tanpa instalasi','Web fallback'], path:'', commandLabel:'Tidak tersedia', runtime:'', cookieFile:'',
    steps:[
      {title:'Gunakan pilihan web', short:'Cara paling sederhana', text:'Buka bagian Tanpa instalasi dan pilih layanan yang sesuai. Jangan masukkan cookies atau password.', html:'<a class="button primary" href="#fallback">Buka pilihan web</a>'},
      {title:'Simpan hasil', short:'Pilih Download atau Save to Files', text:'Setelah file terbuka, gunakan menu Share lalu Save to Files jika diperlukan.', code:''}
    ], footer:'Beberapa situs mungkin dibatasi Safari atau jaringan. Cobalt lebih cocok untuk TikTok dan media sosial daripada YouTube.'
  }
];

const learningResources = {
  windows:{
    youtubeQuery:'yt-dlp Windows 11 install FFmpeg Deno tutorial',
    video:{provider:'Odysee',title:'yt-dlp dan FFmpeg Installation Guide',embed:'https://odysee.com/$/embed/@Trap_Babe:a/yt-dlp_ffmpeg_guide:f',watch:'https://odysee.com/%40Trap_Babe%3Aa/yt-dlp_ffmpeg_guide%3Af',note:'Video dasar untuk komputer. Command terbaru tetap ikuti halaman ini karena tampilan aplikasi bisa berubah.'},
    refs:[
      {type:'Panduan bergambar',title:'Tom’s Hardware — yt-dlp di Windows',desc:'Langkah Windows, FFmpeg, kualitas video, dan contoh command.',url:'https://www.tomshardware.com/how-to/download-youtube-videos'},
      {type:'Panduan komunitas',title:'blackMORE Ops — Windows & Linux',desc:'Instalasi lengkap dengan contoh penggunaan.',url:'https://www.blackmoreops.com/2025/11/05/how-to-install-and-use-yt-dlp-a-complete-guide-for-windows-and-linux/'},
      {type:'Sumber resmi',title:'Wiki instalasi yt-dlp',desc:'Pilihan Winget, binary resmi, pip, dan update.',url:'https://github.com/yt-dlp/yt-dlp/wiki/Installation'}
    ]
  },
  android:{
    youtubeQuery:'yt-dlp Termux Android tutorial ffmpeg deno',
    refs:[
      {type:'Panduan Android',title:'KidCoder — yt-dlp lewat Termux',desc:'Mulai dari Termux, izin storage, sampai command dasar.',url:'https://www.kidcoder.tech/2021/11/youtube-dl-termux.html'},
      {type:'Panduan lengkap',title:'OSTechNix — yt-dlp Android & Linux',desc:'Instalasi, format, playlist, subtitle, dan troubleshooting.',url:'https://ostechnix.com/yt-dlp-tutorial/'},
      {type:'Forum',title:'Android Stack Exchange — Termux',desc:'Diskusi nyata soal yt-dlp/youtube-dl dan penyimpanan Android.',url:'https://android.stackexchange.com/questions/197697/termux-trying-youtube-dl-with-aria2'},
      {type:'Sumber resmi',title:'Termux di GitHub',desc:'Catatan instalasi, izin, dan sumber APK resmi.',url:'https://github.com/termux/termux-app'}
    ]
  },
  ubuntu:{
    youtubeQuery:'yt-dlp Ubuntu Debian install FFmpeg Deno tutorial',
    refs:[
      {type:'Panduan lengkap',title:'OSTechNix — tutorial yt-dlp',desc:'Cocok untuk Ubuntu, Debian, dan distro Linux lain.',url:'https://ostechnix.com/yt-dlp-tutorial/'},
      {type:'Panduan komunitas',title:'blackMORE Ops — Windows & Linux',desc:'Instalasi binary, FFmpeg, dan contoh command.',url:'https://www.blackmoreops.com/2025/11/05/how-to-install-and-use-yt-dlp-a-complete-guide-for-windows-and-linux/'},
      {type:'Sumber resmi',title:'Wiki instalasi yt-dlp',desc:'Binary resmi dan metode pip untuk Linux.',url:'https://github.com/yt-dlp/yt-dlp/wiki/Installation'}
    ]
  },
  fedora:{
    youtubeQuery:'yt-dlp Fedora install ffmpeg deno tutorial',
    refs:[
      {type:'Paket resmi',title:'Fedora Packages — yt-dlp',desc:'Status paket yt-dlp di Fedora.',url:'https://packages.fedoraproject.org/pkgs/yt-dlp/yt-dlp/'},
      {type:'Panduan lengkap',title:'OSTechNix — tutorial yt-dlp',desc:'Command penggunaan dan perbaikan error umum.',url:'https://ostechnix.com/yt-dlp-tutorial/'},
      {type:'Sumber resmi',title:'Wiki instalasi yt-dlp',desc:'Metode binary resmi kalau paket repo tertinggal.',url:'https://github.com/yt-dlp/yt-dlp/wiki/Installation'}
    ]
  },
  arch:{
    youtubeQuery:'yt-dlp Arch Linux Manjaro install tutorial',
    refs:[
      {type:'Wiki distro',title:'ArchWiki — yt-dlp',desc:'Instalasi dan konfigurasi untuk Arch.',url:'https://wiki.archlinux.org/title/Yt-dlp'},
      {type:'Paket resmi',title:'Arch Packages — yt-dlp',desc:'Versi paket dan dependensi saat ini.',url:'https://archlinux.org/packages/extra/any/yt-dlp/'},
      {type:'Panduan lengkap',title:'OSTechNix — tutorial yt-dlp',desc:'Contoh MP4, MP3, playlist, dan subtitle.',url:'https://ostechnix.com/yt-dlp-tutorial/'}
    ]
  },
  opensuse:{
    youtubeQuery:'yt-dlp openSUSE install ffmpeg tutorial',
    refs:[
      {type:'Paket distro',title:'openSUSE Software — yt-dlp',desc:'Pilihan paket untuk Leap dan Tumbleweed.',url:'https://software.opensuse.org/package/yt-dlp'},
      {type:'Panduan lengkap',title:'OSTechNix — tutorial yt-dlp',desc:'Cara pakai setelah paket terpasang.',url:'https://ostechnix.com/yt-dlp-tutorial/'},
      {type:'Sumber resmi',title:'Wiki instalasi yt-dlp',desc:'Binary universal kalau paket distro bermasalah.',url:'https://github.com/yt-dlp/yt-dlp/wiki/Installation'}
    ]
  },
  alpine:{
    youtubeQuery:'yt-dlp Alpine Linux install ffmpeg deno tutorial',
    refs:[
      {type:'Paket distro',title:'Alpine Packages — yt-dlp',desc:'Cari versi yt-dlp di repositori Alpine.',url:'https://pkgs.alpinelinux.org/packages?name=yt-dlp'},
      {type:'Sumber resmi',title:'Wiki instalasi yt-dlp',desc:'Dokumentasi memasang yt-dlp lewat apk.',url:'https://github.com/yt-dlp/yt-dlp/wiki/Installation'},
      {type:'Panduan lengkap',title:'OSTechNix — tutorial yt-dlp',desc:'Contoh command setelah instalasi selesai.',url:'https://ostechnix.com/yt-dlp-tutorial/'}
    ]
  },
  macos:{
    youtubeQuery:'yt-dlp macOS Homebrew FFmpeg Deno tutorial',
    refs:[
      {type:'Panduan macOS',title:'Chrunos — yt-dlp di Mac',desc:'Homebrew, FFmpeg, penggunaan, dan update.',url:'https://chrunos.com/yt-dlp-mac/'},
      {type:'Paket Homebrew',title:'Homebrew Formula — yt-dlp',desc:'Command instalasi dan versi paket Homebrew.',url:'https://formulae.brew.sh/formula/yt-dlp'},
      {type:'Sumber resmi',title:'Wiki instalasi yt-dlp',desc:'Pilihan Homebrew, MacPorts, binary, dan pip.',url:'https://github.com/yt-dlp/yt-dlp/wiki/Installation'}
    ]
  },
  chromeos:{
    youtubeQuery:'yt-dlp Chromebook ChromeOS Linux tutorial',
    refs:[
      {type:'Bantuan resmi',title:'Google — aktifkan Linux di Chromebook',desc:'Menyalakan lingkungan Linux sebelum memasang yt-dlp.',url:'https://support.google.com/chromebook/answer/9145439'},
      {type:'Panduan lengkap',title:'OSTechNix — tutorial yt-dlp',desc:'Lanjutkan dengan langkah Linux/Ubuntu.',url:'https://ostechnix.com/yt-dlp-tutorial/'},
      {type:'Sumber resmi',title:'Wiki instalasi yt-dlp',desc:'Metode binary dan pip di lingkungan Linux.',url:'https://github.com/yt-dlp/yt-dlp/wiki/Installation'}
    ]
  },
  steamos:{
    youtubeQuery:'yt-dlp Steam Deck SteamOS desktop mode tutorial',
    refs:[
      {type:'Bantuan perangkat',title:'Steam — Desktop Mode',desc:'Cara masuk mode desktop sebelum membuka terminal.',url:'https://help.steampowered.com/en/faqs/view/671A-4453-E8D2-323C'},
      {type:'Wiki distro',title:'ArchWiki — yt-dlp',desc:'SteamOS berbasis Arch; lihat konsep paket dan penggunaan.',url:'https://wiki.archlinux.org/title/Yt-dlp'},
      {type:'Sumber resmi',title:'Wiki instalasi yt-dlp',desc:'Binary resmi cocok saat sistem read-only atau paket tertinggal.',url:'https://github.com/yt-dlp/yt-dlp/wiki/Installation'}
    ]
  },
  nixos:{
    youtubeQuery:'yt-dlp NixOS install tutorial ffmpeg deno',
    refs:[
      {type:'Paket distro',title:'NixOS Search — yt-dlp',desc:'Cari paket dan opsi NixOS terbaru.',url:'https://search.nixos.org/packages?query=yt-dlp'},
      {type:'Paket distro',title:'NixOS Search — Deno',desc:'Cari paket runtime Deno.',url:'https://search.nixos.org/packages?query=deno'},
      {type:'Sumber resmi',title:'Wiki instalasi yt-dlp',desc:'Rujukan command dan update yt-dlp.',url:'https://github.com/yt-dlp/yt-dlp/wiki/Installation'}
    ]
  },
  void:{
    youtubeQuery:'yt-dlp Void Linux install tutorial ffmpeg',
    refs:[
      {type:'Paket distro',title:'Void Packages — yt-dlp',desc:'Cari paket yt-dlp untuk arsitektur perangkatmu.',url:'https://voidlinux.org/packages/?arch=x86_64&q=yt-dlp'},
      {type:'Panduan lengkap',title:'OSTechNix — tutorial yt-dlp',desc:'Contoh command dan troubleshooting umum.',url:'https://ostechnix.com/yt-dlp-tutorial/'},
      {type:'Sumber resmi',title:'Wiki instalasi yt-dlp',desc:'Metode universal kalau paket repo belum cocok.',url:'https://github.com/yt-dlp/yt-dlp/wiki/Installation'}
    ]
  },
  'linux-other':{
    youtubeQuery:'yt-dlp Linux install FFmpeg Deno full tutorial',
    refs:[
      {type:'Sumber resmi',title:'Wiki instalasi yt-dlp',desc:'Cara universal dengan binary atau pip.',url:'https://github.com/yt-dlp/yt-dlp/wiki/Installation'},
      {type:'Panduan lengkap',title:'OSTechNix — tutorial yt-dlp',desc:'Instalasi dan penggunaan lintas distro.',url:'https://ostechnix.com/yt-dlp-tutorial/'},
      {type:'Panduan komunitas',title:'blackMORE Ops — Windows & Linux',desc:'Penjelasan langkah demi langkah dan contoh command.',url:'https://www.blackmoreops.com/2025/11/05/how-to-install-and-use-yt-dlp-a-complete-guide-for-windows-and-linux/'}
    ]
  },
  ios:{
    youtubeQuery:'cara simpan video offline iPhone iPad YouTube tutorial',
    refs:[
      {type:'Bantuan resmi',title:'YouTube Help — menonton offline',desc:'Cara resmi menyimpan video untuk ditonton offline jika tersedia.',url:'https://support.google.com/youtube/answer/11977233'},
      {type:'Pilihan mudah',title:'Buka pilihan web di halaman ini',desc:'Tidak perlu terminal. Jangan pernah masukkan password atau cookies.',url:'#fallback'},
      {type:'Catatan',title:'YT Conv Support — iPhone/iPad',desc:'Ikuti langkah Save to Files yang muncul di tutorial perangkat.',url:'#guide'}
    ]
  }
};

const state = {
  detectedId:'windows', selectedId:'windows', filter:'all', search:'', builderId:'windows', tourIndex:0, toastTimer:null
};

function guideById(id){ return guideData.find(g => g.id === id) || guideData[0]; }

function detectPlatform(){
  const ua = navigator.userAgent || '';
  const platform = navigator.userAgentData?.platform || navigator.platform || '';
  const touchMac = /Mac/i.test(platform) && navigator.maxTouchPoints > 1;
  if (/Android/i.test(ua)) return 'android';
  if (/iPhone|iPad|iPod/i.test(ua) || touchMac) return 'ios';
  if (/CrOS/i.test(ua)) return 'chromeos';
  if (/Win/i.test(platform) || /Windows/i.test(ua)) return 'windows';
  if (/Mac/i.test(platform) || /Macintosh/i.test(ua)) return 'macos';
  if (/Linux/i.test(platform) || /Linux/i.test(ua)) return 'ubuntu';
  return 'windows';
}

function showToast(text='Berhasil disalin'){
  const toast = $('#toast');
  if (!toast) return;
  toast.querySelector('span').textContent = text;
  toast.classList.add('show');
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => toast.classList.remove('show'), 1700);
}

async function copyText(text){
  try{
    await navigator.clipboard.writeText(text);
  }catch{
    const area = document.createElement('textarea');
    area.value = text; area.setAttribute('readonly',''); area.style.position='fixed'; area.style.opacity='0';
    document.body.appendChild(area); area.select(); document.execCommand('copy'); area.remove();
  }
  showToast();
}

function initCopyButtons(){
  document.addEventListener('click', event => {
    const button = event.target.closest('.copy-code');
    if (!button) return;
    if (button.hasAttribute('data-copy-generated')) return copyText($('#generatedCommand').textContent.trim());
    const shell = button.closest('.code-shell');
    const code = shell?.querySelector('code');
    if (code) copyText(code.textContent.trim());
  });
}

function renderDetection(){
  state.detectedId = detectPlatform();
  state.selectedId = state.detectedId;
  state.builderId = state.detectedId === 'ios' ? 'windows' : state.detectedId;
  const guide = guideById(state.detectedId);
  $('#detectedIcon').textContent = guide.icon;
  $('#detectedTitle').textContent = guide.title;
  $('#detectedText').textContent = guide.id === 'ubuntu'
    ? 'Linux terdeteksi. Pilih distro di bawah agar perintahnya pas.'
    : `Tutorial ${guide.title} sudah disiapkan.`;
  const linux = state.detectedId === 'ubuntu' && /Linux/i.test(navigator.userAgent) && !/Android|CrOS/i.test(navigator.userAgent);
  $('#linuxDetect').hidden = !linux;
  if (linux){
    const picks = ['ubuntu','fedora','arch','opensuse','alpine','nixos','linux-other'];
    $('#linuxQuickPick').innerHTML = picks.map(id => `<button class="mini-chip" type="button" data-quick-guide="${id}">${escapeHtml(guideById(id).title.split(' / ')[0])}</button>`).join('');
  }
}

function renderDeviceList(){
  const list = $('#deviceList');
  const term = state.search.trim().toLowerCase();
  const visible = guideData.filter(g => {
    const filterOk = state.filter === 'all' || g.category.includes(state.filter);
    const haystack = `${g.title} ${g.short} ${g.family} ${g.tags}`.toLowerCase();
    return filterOk && (!term || haystack.includes(term));
  });
  list.innerHTML = visible.map(g => `
    <button class="device-card ${g.id===state.selectedId?'selected':''} ${g.id===state.detectedId?'recommended':''}" type="button" data-guide="${g.id}" aria-pressed="${g.id===state.selectedId}">
      <span class="device-card-icon">${escapeHtml(g.icon)}</span>
      <span><strong>${escapeHtml(g.title)}</strong><small>${escapeHtml(g.short)}</small></span>
    </button>`).join('');
  $('#deviceEmpty').hidden = visible.length > 0;
}

function renderCode(code, label='Command'){
  if (!code) return '';
  return `<div class="code-shell"><div class="code-head"><span>${escapeHtml(label)}</span><button class="copy-code" type="button">Salin</button></div><pre><code>${escapeHtml(code)}</code></pre></div>`;
}

function youtubeSearchUrl(query){
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

function renderLearning(g){
  const resource = learningResources[g.id] || learningResources['linux-other'];
  const watchedKey = `ytconv-learning-${g.id}`;
  const watched = storage.get(watchedKey) === 'done';
  const refCount = resource.refs?.length || 0;
  $('#guideLearningTitle').textContent = `Nonton atau baca dulu — ${g.title}`;
  $('#guideLearningText').textContent = resource.video
    ? 'Video bisa diputar di halaman ini. Setelah itu, ikuti command terbaru di bawah.'
    : 'Belum ada video spesifik yang berani kami tempel. Buka pencarian YouTube atau pilih bacaan yang paling gampang.';
  $('#guideResourceCount').textContent = `${refCount + (resource.video ? 1 : 0)} pilihan`;

  const videoHtml = resource.video ? `
    <article class="video-card">
      <div class="video-shell" data-video-shell>
        <button class="video-placeholder" type="button" data-load-video="${escapeHtml(g.id)}" aria-label="Putar ${escapeHtml(resource.video.title)}">
          <span class="play-button" aria-hidden="true">▶</span>
          <span><small>${escapeHtml(resource.video.provider)}</small><strong>${escapeHtml(resource.video.title)}</strong><em>Tekan untuk memuat video</em></span>
        </button>
      </div>
      <div class="video-meta"><p>${escapeHtml(resource.video.note || '')}</p><a href="${escapeHtml(resource.video.watch)}" target="_blank" rel="noopener noreferrer">Buka video di tab baru ↗</a></div>
    </article>` : `
    <div class="no-video-card">
      <span class="no-video-icon" aria-hidden="true">▶</span>
      <div><strong>Cari video yang paling baru</strong><p>Hasil YouTube berubah terus, jadi kamu bisa pilih video yang bahas OS-mu dan tanggalnya paling baru.</p></div>
    </div>`;

  const refsHtml = (resource.refs || []).map(ref => `
    <a class="resource-card" href="${escapeHtml(ref.url)}" ${ref.url.startsWith('#') ? '' : 'target="_blank" rel="noopener noreferrer"'}>
      <span class="resource-type">${escapeHtml(ref.type)}</span>
      <strong>${escapeHtml(ref.title)}</strong>
      <small>${escapeHtml(ref.desc)}</small>
      <b aria-hidden="true">↗</b>
    </a>`).join('');

  $('#guideMedia').innerHTML = `
    ${videoHtml}
    <div class="learning-actions">
      <a class="button youtube-button" href="${escapeHtml(youtubeSearchUrl(resource.youtubeQuery))}" target="_blank" rel="noopener noreferrer">
        <span aria-hidden="true">▶</span> Cari tutorial di YouTube
      </a>
      <button class="button secondary ${watched ? 'completed' : ''}" type="button" data-learning-done="${escapeHtml(g.id)}">${watched ? '✓ Sudah dilihat' : 'Sudah paham, lanjut'}</button>
    </div>
    <details class="reference-drawer" ${resource.video ? '' : 'open'}>
      <summary><span>Referensi lain</span><small>${refCount} sumber</small></summary>
      <div class="resource-list">${refsHtml}</div>
    </details>`;
}

function initLearning(){
  document.addEventListener('click', event => {
    const load = event.target.closest('[data-load-video]');
    if (load){
      const id = load.dataset.loadVideo;
      const resource = learningResources[id];
      const video = resource?.video;
      const shell = load.closest('[data-video-shell]');
      if (!video || !shell) return;
      shell.innerHTML = `<iframe class="video-frame" src="${escapeHtml(video.embed)}" title="${escapeHtml(video.title)}" loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
      return;
    }
    const done = event.target.closest('[data-learning-done]');
    if (done){
      const key = `ytconv-learning-${done.dataset.learningDone}`;
      const isDone = storage.get(key) === 'done';
      if (isDone){ storage.remove(key); done.textContent = 'Sudah paham, lanjut'; done.classList.remove('completed'); }
      else { storage.set(key,'done'); done.textContent = '✓ Sudah dilihat'; done.classList.add('completed'); $('#guideSteps').scrollIntoView({behavior:'smooth',block:'start'}); }
    }
  });
}

function renderGuide(id, options={scroll:false}){
  const g = guideById(id);
  state.selectedId = g.id;
  $('#guideIcon').textContent = g.icon;
  $('#guideFamily').textContent = g.family;
  $('#guideTitle').textContent = g.title;
  $('#guideIntro').textContent = g.intro;
  $('#guideStatus').textContent = g.status;
  $('#guideSummary').innerHTML = g.summary.map(x => `<span class="summary-chip">${escapeHtml(x)}</span>`).join('');
  renderLearning(g);
  $('#guideSteps').innerHTML = g.steps.map((step,index) => `
    <details class="guide-step" ${index===0?'open':''}>
      <summary><span class="step-number">${index+1}</span><span class="step-summary-text"><strong>${escapeHtml(step.title)}</strong><small>${escapeHtml(step.short)}</small></span><span class="step-toggle">＋</span></summary>
      <div class="step-content"><p>${escapeHtml(step.text || '')}</p>${step.html || ''}${renderCode(step.code, step.label)}</div>
    </details>`).join('');
  $('#guideFooterNote').innerHTML = g.footer ? `<strong>Catatan:</strong> ${escapeHtml(g.footer)}` : '';
  renderDeviceList();
  if (g.id !== 'ios') { state.builderId = g.id; renderBuilderPlatforms(); updateBuilder(); }
  if (options.scroll) $('#guidePanel').scrollIntoView({behavior:'smooth',block:'start'});
}

function initDeviceUI(){
  $('#deviceSearch').addEventListener('input', e => { state.search=e.target.value; renderDeviceList(); });
  $('#deviceFilters').addEventListener('click', e => {
    const btn=e.target.closest('[data-filter]'); if(!btn)return;
    state.filter=btn.dataset.filter;
    $$('#deviceFilters [data-filter]').forEach(x=>x.classList.toggle('active',x===btn));
    renderDeviceList();
  });
  $('#deviceList').addEventListener('click', e => { const btn=e.target.closest('[data-guide]'); if(btn)renderGuide(btn.dataset.guide,{scroll:true}); });
  $('#linuxQuickPick').addEventListener('click', e => { const btn=e.target.closest('[data-quick-guide]'); if(btn)renderGuide(btn.dataset.quickGuide,{scroll:true}); });
  $('#useDetectedButton').addEventListener('click',()=>renderGuide(state.detectedId,{scroll:true}));
}

function builderGuides(){ return ['windows','ubuntu','macos','android','chromeos','alpine'].map(guideById); }
function renderBuilderPlatforms(){
  $('#builderPlatforms').innerHTML=builderGuides().map(g=>`<button class="platform-chip ${g.id===state.builderId?'active':''}" type="button" role="tab" aria-selected="${g.id===state.builderId}" data-builder="${g.id}">${escapeHtml(g.title.split(' / ')[0])}</button>`).join('');
}

function updateCookieOptions(g){
  const select=$('#cookieSelect'); const old=select.value;
  const fileLabel = g.id==='android' ? 'Pakai cookies.txt dari Download' : 'Pakai cookies.txt';
  const options = g.id==='android' || g.id==='ios'
    ? [{v:'none',t:'Tidak perlu'},{v:'file',t:fileLabel}]
    : [{v:'none',t:'Tidak perlu'},{v:'chrome',t:'Ambil dari Chrome'},{v:'edge',t:'Ambil dari Edge'},{v:'firefox',t:'Ambil dari Firefox'},{v:'file',t:fileLabel}];
  select.innerHTML=options.map(o=>`<option value="${o.v}">${o.t}</option>`).join('');
  select.value=options.some(o=>o.v===old)?old:'none';
}

function getCookieArg(g){
  const value=$('#cookieSelect').value;
  if(value==='none')return '';
  if(value==='file')return `--cookies ${g.cookieFile}`;
  return `--cookies-from-browser ${value}`;
}

function quoteUrl(value){ return `"${(value||'TAUTAN_VIDEO').replaceAll('"','')}"`; }
function updateBuilder(){
  const g=guideById(state.builderId);
  updateCookieOptions(g);
  const format=$('#formatSelect').value;
  const quality=$('#qualitySelect').value;
  const url=$('#videoUrl').value.trim();
  const cookie=getCookieArg(g);
  const pieces=['yt-dlp'];
  if(g.runtime)pieces.push(g.runtime);
  if(cookie)pieces.push(cookie);
  if(format==='mp4'){
    const selector=quality==='best'?'bv*+ba/b':`bv*[height<=${quality}]+ba/b[height<=${quality}]`;
    pieces.push('-f',`"${selector}"`,'--merge-output-format','mp4');
  }else if(format==='mp3')pieces.push('-x','--audio-format','mp3','--audio-quality','0');
  else pieces.push('-x','--audio-format','m4a');
  if($('#subtitleCheck').checked){
    pieces.push('--write-auto-subs','--write-subs','--sub-langs','"id.*,id,en.*"');
    if(format==='mp4')pieces.push('--embed-subs');
  }
  if($('#thumbnailCheck').checked)pieces.push('--embed-thumbnail');
  if(g.path)pieces.push('-P',g.path);
  pieces.push(quoteUrl(url));
  $('#generatedCommand').textContent=pieces.join(' ');
  $('#commandLabel').textContent=g.commandLabel;
  $('#qualityField').hidden=format!=='mp4';
  let tip = g.id==='android' ? 'Hasil masuk Penyimpanan internal → Download.' : g.id==='chromeos' ? 'Hasil masuk My files → Downloads.' : 'Hasil masuk folder Downloads.';
  if(g.id==='android' && $('#cookieSelect').value==='file') tip+=' Taruh cookies.txt di folder Download.';
  $('#builderTip').textContent=tip;
  $('#urlMessage').textContent=url ? (/^https?:\/\//i.test(url)?'Link siap dipakai.':'Link sebaiknya diawali http:// atau https://') : 'Boleh dikosongkan dulu.';
}

function initBuilder(){
  renderBuilderPlatforms();
  $('#builderPlatforms').addEventListener('click',e=>{const btn=e.target.closest('[data-builder]');if(!btn)return;state.builderId=btn.dataset.builder;renderBuilderPlatforms();updateBuilder();});
  ['videoUrl','formatSelect','qualitySelect','cookieSelect','subtitleCheck','thumbnailCheck'].forEach(id=>$('#'+id).addEventListener('input',updateBuilder));
  updateBuilder();
}

function initProgress(){
  const key='ytconv-prep-v2'; let saved={};
  try{saved=JSON.parse(storage.get(key)||'{}')}catch{}
  $$('[data-progress]').forEach(box=>{box.checked=Boolean(saved[box.dataset.progress]);box.addEventListener('change',()=>{saved[box.dataset.progress]=box.checked;storage.set(key,JSON.stringify(saved));renderProgress();});});
  function renderProgress(){const boxes=$$('[data-progress]');const done=boxes.filter(x=>x.checked).length;$('#progressText').textContent=`${done}/${boxes.length}`;$('#progressBar').style.width=`${done/boxes.length*100}%`;}
  $('#resetProgress').addEventListener('click',()=>{saved={};storage.remove(key);$$('[data-progress]').forEach(x=>x.checked=false);renderProgress();});
  renderProgress();
}

function initCookies(){
  $('.cookie-tabs').addEventListener('click',e=>{const tab=e.target.closest('[data-cookie-tab]');if(!tab)return;const id=tab.dataset.cookieTab;$$('.cookie-tab').forEach(x=>{const on=x===tab;x.classList.toggle('active',on);x.setAttribute('aria-selected',String(on));});$$('[data-cookie-panel]').forEach(x=>x.classList.toggle('active',x.dataset.cookiePanel===id));});
}

function initErrorSearch(){
  $('#errorSearch').addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase();let count=0;$$('.error-item').forEach(item=>{const text=(item.dataset.keywords+' '+item.textContent).toLowerCase();const show=!q||text.includes(q);item.hidden=!show;if(show)count++;});$('#errorEmpty').hidden=count>0;});
}

function initTheme(){
  const saved=storage.get('ytconv-theme');
  const initial=saved || (matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
  setTheme(initial);
  $$('.theme-toggle').forEach(btn=>btn.addEventListener('click',()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark')));
  function setTheme(theme){document.documentElement.dataset.theme=theme;storage.set('ytconv-theme',theme);$('#themeLabel').textContent=theme==='dark'?'Mode terang':'Mode gelap';$$('.sun-icon').forEach(x=>x.style.display=theme==='dark'?'none':'block');$$('.moon-icon').forEach(x=>x.style.display=theme==='dark'?'block':'none');document.querySelector('meta[name=theme-color]').content=theme==='dark'?'#212121':'#ffffff';}
}

function initMobileMenu(){
  const sidebar=$('#sidebar'),backdrop=$('#sidebarBackdrop'),button=$('#menuButton');
  const close=()=>{sidebar.classList.remove('open');backdrop.hidden=true;button.setAttribute('aria-expanded','false');};
  button.addEventListener('click',()=>{const open=!sidebar.classList.contains('open');sidebar.classList.toggle('open',open);backdrop.hidden=!open;button.setAttribute('aria-expanded',String(open));});
  backdrop.addEventListener('click',close);$$('.side-nav a').forEach(a=>a.addEventListener('click',close));
}

function initNavSpy(){
  const links=$$('.nav-link');
  const observer=new IntersectionObserver(entries=>{const visible=entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!visible)return;links.forEach(l=>l.classList.toggle('active',l.dataset.section===visible.target.id));},{rootMargin:'-15% 0px -65%',threshold:[0,.2,.5]});
  $$('.section-anchor').forEach(s=>observer.observe(s));
}

const tourSteps=[
  {selector:'#detectedCard',title:'Perangkatmu',text:'Situs memilih tutorial awal dari perangkat yang terbaca.'},
  {selector:'#prepList',title:'Bahan dulu',text:'Centang persiapan dasar supaya instalasi nggak berhenti di tengah.'},
  {selector:'#deviceToolbar',title:'Pilih OS',text:'Cari distro atau OS. Linux biasanya perlu dipilih manual.'},
  {selector:'#guideLearning',title:'Nonton dulu',text:'Putar video jika tersedia, atau buka YouTube dan referensi yang sudah dipilih.'},
  {selector:'#builderCard',title:'Buat command',text:'Tempel link, pilih MP4 atau MP3, lalu salin.'},
  {selector:'#cookies .recommended-card',title:'Kalau diminta login',text:'Utamakan cookies dari browser milikmu sendiri.'}
];
function initTour(){
  const overlay=$('#tourOverlay'),popover=$('.tour-popover');
  const clear=()=>$$('.tour-target').forEach(x=>x.classList.remove('tour-target'));
  function close(){clear();overlay.hidden=true;document.body.style.overflow='';}
  function place(){
    clear(); const step=tourSteps[state.tourIndex],target=$(step.selector); if(!target)return close();
    target.scrollIntoView({behavior:'smooth',block:'center'});
    setTimeout(()=>{
      target.classList.add('tour-target');overlay.hidden=false;document.body.style.overflow='hidden';
      $('#tourCount').textContent=`${state.tourIndex+1}/${tourSteps.length}`;$('#tourTitle').textContent=step.title;$('#tourText').textContent=step.text;$('#tourNext').textContent=state.tourIndex===tourSteps.length-1?'Selesai':'Lanjut';
      if(innerWidth>760){const r=target.getBoundingClientRect();const pw=330;let left=Math.min(innerWidth-pw-18,Math.max(18,r.right-pw));let top=r.bottom+12;if(top+220>innerHeight)top=Math.max(18,r.top-210);popover.style.left=`${left}px`;popover.style.top=`${top}px`;popover.style.right='auto';popover.style.bottom='auto';}
    },350);
  }
  $('#startTourButton').addEventListener('click',()=>{state.tourIndex=0;place();});
  $('#tourClose').addEventListener('click',close);
  $('#tourNext').addEventListener('click',()=>{if(state.tourIndex>=tourSteps.length-1)close();else{state.tourIndex++;place();}});
  addEventListener('resize',()=>{if(!overlay.hidden)place();});
  addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden)close();});
}

function initDetails(){
  document.addEventListener('toggle',e=>{
    if(!(e.target instanceof HTMLDetailsElement))return;
    const plus=e.target.querySelector(':scope > summary b'); if(plus)plus.textContent='＋';
  },true);
}

function boot(){
  initTheme();initMobileMenu();initCopyButtons();renderDetection();initDeviceUI();renderDeviceList();renderGuide(state.detectedId);initLearning();initBuilder();initProgress();initCookies();initErrorSearch();initNavSpy();initTour();initDetails();
}

document.addEventListener('DOMContentLoaded',boot);
