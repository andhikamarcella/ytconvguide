# YT Conv Support

Website bantuan ketika YT Conv sedang error. Proyek ini berupa website statis sehingga ringan, tidak membutuhkan framework, tidak membutuhkan proses build, dan dapat langsung dipasang ke Vercel.

## Isi website

- pembuat perintah MP4 dan MP3 untuk Windows, Linux, macOS, dan Android
- panduan Windows 10/11
- panduan Ubuntu, Debian, Linux Mint, Pop!_OS, Zorin OS, dan Kali Linux
- panduan Fedora
- panduan Arch, Manjaro, EndeavourOS, Garuda, dan CachyOS
- panduan openSUSE
- panduan Alpine Linux dan postmarketOS
- cara universal untuk distro Linux lainnya
- panduan macOS
- panduan Android menggunakan Termux
- tautan langsung Termux APK
- panduan ChromeOS / Chromebook
- panduan Steam Deck / SteamOS
- arahan iPhone dan iPad melalui pilihan web
- panduan cookies dari browser milik sendiri
- pilihan web cadangan: YT1s, noTube, dan Cobalt
- pencarian error umum
- mode terang dan gelap
- tampilan responsif untuk komputer, tablet, dan HP

## Struktur proyek

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

## Cara melihat di komputer

Buka `index.html` langsung di browser, atau jalankan server lokal:

```bash
python -m http.server 8080
```

Kemudian buka `http://localhost:8080`.

## Cara deploy ke Vercel tanpa Codex

1. Buat repository baru di GitHub.
2. Pilih **Add file → Upload files**.
3. Unggah seluruh isi folder ini, termasuk folder `assets`.
4. Buka Vercel dan pilih **Add New → Project**.
5. Pilih repository tadi.
6. Biarkan **Build Command** dan **Output Directory** kosong.
7. Tekan **Deploy**.

## Catatan keamanan

- Jangan unggah `cookies.txt` ke GitHub.
- Gunakan cookies hanya dari browser dan akun milik sendiri.
- Jangan memasukkan kata sandi atau OTP ke situs pihak ketiga.
- Gunakan alat unduh hanya untuk konten milik sendiri, bebas pakai, atau sudah mendapat izin.
- Perintah package manager dapat berubah pada rilis distro yang sangat lama atau repositori yang telah dimodifikasi.

## Mengubah isi

- teks dan struktur halaman: `index.html`
- desain, tema, dan responsif: `style.css`
- pembuat command, filter perangkat, panduan interaktif, tombol salin, dan pencarian: `script.js`
