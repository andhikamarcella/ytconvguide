(()=>{
'use strict';
const CLI_VERSION='1.0.0';
const UPDATED='17 Juli 2026';
const $=(selector,root=document)=>root.querySelector(selector);

function updateVersionText(){
  const badge=$('#cli .verified-badge');
  if(badge)badge.textContent=`v${CLI_VERSION}`;
  const identity=$('#cli .cli-package-identity strong');
  if(identity)identity.textContent=`ytconv@${CLI_VERSION}`;
  const release=$('#cli .cli-release-note');
  if(release)release.innerHTML=`<span class="status-dot"></span><div><strong>Last update: YTConv CLI ${CLI_VERSION}</strong><small>Video, audio, gambar, carousel, reels, Instagram Stories/Highlights, gallery-dl, update wajib, CMD, dan Termux.</small></div>`;
  const status=$('.source-status span:last-child');
  if(status)status.innerHTML=`<strong>YTConv CLI v${CLI_VERSION}</strong><small>Diperbarui ${UPDATED}</small>`;
  const footer=$('.site-footer p:last-child');
  if(footer)footer.textContent=`Last update: YTConv CLI v${CLI_VERSION} · ${UPDATED}.`;
  const meta=$('meta[name="description"]');
  if(meta)meta.content=`Instal YTConv CLI v${CLI_VERSION} untuk video, audio, gambar, carousel, reels, Instagram Stories, Pinterest, CMD, dan Termux.`;
  const schema=[...document.querySelectorAll('script[type="application/ld+json"]')].find(node=>node.textContent.includes('YTConv CLI'));
  if(schema){try{const value=JSON.parse(schema.textContent);value.softwareVersion=CLI_VERSION;schema.textContent=JSON.stringify(value)}catch{}}
}

function installV100Guide(){
  const anchor=$('#cli056Update')||$('#cli055Features');
  if(!anchor||$('#cli100Media'))return;
  anchor.insertAdjacentHTML('beforebegin',`
    <article class="cli-release-card" id="cli100Media">
      <div class="cli-release-head">
        <div><p class="kicker">Versi stabil 1.0</p><h3>Satu link untuk video, audio, gambar, carousel, reels, dan story</h3></div>
        <span class="verified-badge">v${CLI_VERSION}</span>
      </div>
      <p>YTConv sekarang memakai <code>yt-dlp</code> untuk video/audio dan <code>gallery-dl</code> untuk gambar, carousel, posting campuran, reels/story tertentu, Pinterest, serta situs galeri. Mode otomatis memilih engine berdasarkan link.</p>
      <div class="cli-command-row">
        <div class="code-shell"><div class="code-head"><span>Install / update</span><button class="copy-code" type="button">Salin</button></div><pre><code>npm install -g ytconv@latest
ytconv --version
ytconv</code></pre></div>
        <div class="code-shell"><div class="code-head"><span>Gambar dan carousel</span><button class="copy-code" type="button">Salin</button></div><pre><code>ytconv --image "LINK_POST"
ytconv --auto "LINK_POST"</code></pre></div>
      </div>
      <div class="cli-command-row">
        <div class="code-shell"><div class="code-head"><span>Instagram Stories</span><button class="copy-code" type="button">Salin</button></div><pre><code>ytconv --stories --cookies cookies.txt "https://www.instagram.com/username/"</code></pre></div>
        <div class="code-shell"><div class="code-head"><span>Semua media Instagram</span><button class="copy-code" type="button">Salin</button></div><pre><code>ytconv --all-media --cookies cookies.txt "https://www.instagram.com/username/"</code></pre></div>
      </div>
      <div class="cli-release-note"><span class="status-dot"></span><div><strong>Carousel disimpan lengkap</strong><small>Untuk posting yang didukung, semua gambar/video pada carousel disimpan, bukan hanya item pertama.</small></div></div>
      <details class="error-item" data-keywords="instagram story stories highlights private cookies login gallery-dl carousel image reels">
        <summary><span><code>Story atau akun privat gagal</code><small>Gunakan cookies akun yang memang punya akses</small></span><b>＋</b></summary>
        <div class="error-answer"><p>Story, highlights, login-only, dan akun privat membutuhkan file Netscape <code>cookies.txt</code> yang masih aktif. YTConv tidak dapat membuka media yang akun tersebut sendiri tidak bisa lihat.</p><div class="code-shell"><div class="code-head"><span>Termux</span><button class="copy-code" type="button">Salin</button></div><pre><code>ytconv --stories --cookies "$HOME/storage/downloads/cookies.txt" "PROFILE_URL"</code></pre></div></div>
      </details>
    </article>`);
}

function replaceUpdateGuide(){
  const card=$('#cli056Update');
  if(!card)return;
  card.querySelector('h3').textContent='YTConv 1.0.0 mewajibkan versi terbaru sebelum converter dibuka';
  const paragraph=card.querySelector('p:not(.kicker)');
  if(paragraph)paragraph.innerHTML='Mulai versi <code>1.0.0</code>, update berikutnya dipasang sebelum aplikasi dapat digunakan. Versi <code>0.5.6+</code> dapat mendeteksi 1.0.0; versi <code>0.5.5</code> atau lebih lama perlu satu kali update manual karena kode lama tidak bisa diubah dari jarak jauh.';
  const badge=card.querySelector('.verified-badge');
  if(badge)badge.textContent=`v${CLI_VERSION}`;
}

function installErrors(){
  const list=$('#errorList');
  if(!list||$('#galleryEngineError'))return;
  list.insertAdjacentHTML('afterbegin',`
    <details class="error-item featured-error" id="galleryEngineError" data-keywords="gallery-dl image carousel story reels engine tidak ditemukan termux python">
      <summary><span><code>Gambar, carousel, atau story tidak terunduh</code><small>Cek gallery-dl, cookies, dan mode image</small></span><b>＋</b></summary>
      <div class="error-answer">
        <p>Jalankan diagnostics. <code>gallery-dl</code> harus muncul bersama yt-dlp dan FFmpeg.</p>
        <div class="code-shell"><div class="code-head"><span>Diagnostics dan perbaikan</span><button class="copy-code" type="button">Salin</button></div><pre><code>ytconv --diagnose
npm install -g ytconv@latest</code></pre></div>
        <p>Termux fallback:</p>
        <div class="code-shell"><div class="code-head"><span>Termux</span><button class="copy-code" type="button">Salin</button></div><pre><code>pkg install -y python ffmpeg
python -m pip install -U yt-dlp gallery-dl
hash -r</code></pre></div>
      </div>
    </details>
    <details class="error-item" id="oldVersionUpdateError" data-keywords="versi lama 0.5.5 0.5.4 tidak detect update wajib manual">
      <summary><span><code>Versi lama tidak memberi notifikasi 1.0.0</code><small>0.5.5 dan lebih lama perlu update manual sekali</small></span><b>＋</b></summary>
      <div class="error-answer"><div class="code-shell"><div class="code-head"><span>Update satu kali</span><button class="copy-code" type="button">Salin</button></div><pre><code>npm install -g ytconv@latest
ytconv --version</code></pre></div><p>Setelah sudah berada di 1.0.0, update berikutnya dideteksi dan diwajibkan otomatis.</p></div>
    </details>`);
}

function refreshCopyButtons(){
  document.querySelectorAll('.copy-code').forEach(button=>{
    if(button.dataset.cli100Ready)return;
    button.dataset.cli100Ready='true';
    button.addEventListener('click',async()=>{
      const code=button.closest('.code-shell')?.querySelector('code')?.textContent?.trim();
      if(!code)return;
      try{await navigator.clipboard.writeText(code);button.textContent='Tersalin';setTimeout(()=>button.textContent='Salin',1400)}catch{}
    });
  });
}

function mount(){
  if(!$('#cli')){setTimeout(mount,50);return}
  updateVersionText();
  installV100Guide();
  replaceUpdateGuide();
  installErrors();
  refreshCopyButtons();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
