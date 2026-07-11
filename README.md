# YT Conv Support

Website statis untuk panduan saat YT Conv error. Ringan, responsif, dan siap dipasang di Vercel.

## Fitur

- Deteksi Windows, Linux, macOS, Android, iPhone/iPad, dan ChromeOS.
- Pilihan distro Linux.
- Tur spotlight interaktif.
- Pembuat perintah yt-dlp untuk MP4/MP3.
- Panduan extension cookies dari Google Drive dan Chrome Web Store.
- Tombol Termux APK langsung.
- Web cadangan: YT1s, noTube, dan Cobalt.
- Mode terang/gelap dan pencarian error.

## Struktur

```text
yt-conv-support-vercel/
├── index.html
├── style.css
├── script.js
├── vercel.json
├── .gitignore
└── assets/
    └── favicon.svg
```

## Deploy ke Vercel

1. Upload semua file ke repository GitHub.
2. Di Vercel pilih **New Project**.
3. Impor repository tersebut.
4. Tekan **Deploy**. Tidak perlu Build Command.

## Keamanan

Jangan unggah `cookies.txt`. File tersebut sudah dimasukkan ke `.gitignore`, tetapi tetap periksa sebelum commit.
