# Unduh Lagi

Website panduan sederhana saat layanan unduh utama sedang error. Isinya mencakup:

- yt-dlp dan FFmpeg di Windows CMD
- pembuat perintah MP4/MP3 yang bisa langsung disalin
- cookies dari browser milik sendiri
- yt-dlp dan FFmpeg di Android lewat Termux
- pilihan web cadangan: YT1s untuk MP4, noTube, dan Cobalt
- daftar solusi untuk error umum
- petunjuk deploy ke Vercel

## Struktur proyek

```text
unduh-lagi-vercel/
├── index.html
├── style.css
├── script.js
├── vercel.json
├── README.md
└── assets/
    └── favicon.svg
```

## Cara melihat di komputer

Cukup buka `index.html` di browser. Untuk hasil yang sama seperti website online, jalankan server lokal:

```bash
python -m http.server 8080
```

Lalu buka `http://localhost:8080`.

## Cara deploy ke Vercel tanpa Codex

1. Buat repository baru di GitHub.
2. Pilih **Add file → Upload files**.
3. Unggah seluruh isi folder ini, termasuk folder `assets`.
4. Buka Vercel, pilih **Add New → Project**.
5. Pilih repository tadi dan tekan **Deploy**.
6. Biarkan Build Command dan Output Directory kosong.

## Catatan keamanan

- Cookies adalah data akun yang sensitif. Jangan unggah `cookies.txt` ke GitHub.
- Gunakan hanya cookies dari browser dan akun milik sendiri.
- Gunakan alat unduh hanya untuk konten milik sendiri, bebas pakai, atau sudah mendapat izin.
- Situs web cadangan adalah layanan pihak ketiga dan dapat berubah sewaktu-waktu.

## Mengganti nama atau tulisan

Semua isi utama ada di `index.html`. Tampilan ada di `style.css`, sedangkan tombol salin, tema, pencarian, dan pembuat perintah ada di `script.js`.
