# YT Conv Support

Website statis ringan untuk panduan yt-dlp dan FFmpeg saat YT Conv error.

## Fitur

- Deteksi Windows, Linux, macOS, Android, iPhone/iPad, dan ChromeOS.
- Panduan Ubuntu/Debian, Fedora, Arch, openSUSE, Alpine, Linux universal, Steam Deck, dan perangkat lain.
- Tur spotlight.
- Pembuat perintah MP4/MP3.
- Tutorial extension cookies.
- Link Termux APK langsung.
- Mode terang/gelap dan tampilan responsif.

## Struktur

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

## Deploy ke Vercel

1. Upload semua file ke repository GitHub.
2. Di Vercel pilih **New Project**.
3. Pilih repository tersebut.
4. Framework Preset: **Other**.
5. Build Command dan Output Directory dikosongkan.
6. Tekan **Deploy**.

## Catatan Android

Path `$HOME/storage/downloads` menunjuk ke **Penyimpanan internal → Download** setelah menjalankan `termux-setup-storage` dan memberi izin penyimpanan.

## Tautan tambahan

- Tombol **YT Conv Docs** menuju `https://ytconvdocs.vercel.app/`.
