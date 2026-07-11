# YT Conv Support

Website bantuan saat YT Conv sedang error. Pengguna memilih perangkat, memasang bahan yang dibutuhkan, lalu menyalin command yt-dlp yang sudah dibuat otomatis.

## Isi tutorial

- Deteksi Windows, Linux, macOS, Android, iPhone/iPad, dan ChromeOS.
- Panduan Windows 10/11, Android Termux, Ubuntu/Debian, Fedora, Arch/Manjaro, openSUSE, Alpine, macOS, ChromeOS, SteamOS, NixOS, Void, dan Linux lainnya.
- Persiapan sebelum yt-dlp: terminal, ruang penyimpanan, yt-dlp, FFmpeg, dan runtime JavaScript Deno/Node.js.
- Pembuat command MP4, MP3, M4A, kualitas video, subtitle, thumbnail, dan cookies.
- Tutorial Cookie-Editor dari Chrome Web Store atau file extension manual.
- Pencarian solusi error.
- Tur spotlight, tema terang/gelap, dan tampilan responsif.
- Tombol Docs menuju `ytconvdocs.vercel.app`.
- Link kembali ke `ytconv.onrender.com`.

## Struktur folder

```text
yt-conv-support-vercel/
├── index.html
├── style.css
├── script.js
├── vercel.json
├── README.md
├── .gitignore
└── assets/
    └── favicon.svg
```

Tidak ada framework, package npm, database, atau proses build. Website dapat dibuka langsung dari `index.html` atau di-host sebagai situs statis.

## Upload ke GitHub

1. Buat repository baru.
2. Pilih **Add file → Upload files**.
3. Upload seluruh isi folder, termasuk folder `assets` dan file `.gitignore`.
4. Commit perubahan.

## Deploy ke Vercel

1. Pilih **New Project** di Vercel.
2. Impor repository GitHub.
3. Framework Preset: **Other**.
4. Kosongkan Build Command dan Output Directory.
5. Tekan **Deploy**.

## Catatan Android

Setelah menjalankan `termux-setup-storage` dan menekan **Izinkan**, path:

```bash
$HOME/storage/downloads
```

menunjuk ke **Penyimpanan internal → Download**, bukan kartu SD fisik.

## Keamanan cookies

`cookies.txt` dapat membuka sesi akun. Jangan dibagikan atau diunggah. `.gitignore` sudah mencegah nama file cookies umum ikut terunggah, tetapi pengguna tetap harus memeriksa commit sebelum mengirimnya ke GitHub.

## Pengujian

Antarmuka diuji di Chromium ukuran desktop dan mobile, termasuk deteksi perangkat, pilihan tutorial, filter distro, pembuat command, tema, tab cookies, pencarian error, dan tur spotlight. Command pemasangan disusun dari dokumentasi resmi terkait, tetapi tidak mungkin dijalankan secara fisik pada semua sistem operasi dari satu mesin pengujian. Karena paket distro dapat berubah, periksa kembali sumber resmi jika package manager menampilkan nama paket yang berbeda.

Referensi utama diperiksa pada 11 Juli 2026: dokumentasi yt-dlp, yt-dlp EJS, Deno, FFmpeg, Termux, Chrome Extensions, Homebrew, dan dokumentasi ChromeOS Linux.

## Video dan referensi per perangkat

Setiap pilihan OS sekarang menampilkan bagian **Bingung? Nonton dulu** sebelum command. Bagian ini menyediakan:

- pencarian YouTube yang sudah disesuaikan dengan OS/distro,
- video terverifikasi yang dimuat hanya setelah tombol putar ditekan,
- referensi resmi, artikel, wiki distro, atau forum kalau video spesifik belum tersedia,
- penanda “Sudah dilihat” yang tersimpan di browser.

Pencarian YouTube dibuka sebagai halaman hasil pencarian, bukan iframe pencarian, karena mode embed pencarian YouTube sudah tidak didukung. Jangan menambahkan ID video yang belum diverifikasi.
