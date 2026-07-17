(()=>{
'use strict';
const CLI_VERSION='1.0.2';
const UPDATED='17 Juli 2026';
const $=(selector,root=document)=>root.querySelector(selector);

function updateVersionText(){
  const badge=$('#cli .verified-badge');
  if(badge)badge.textContent=`v${CLI_VERSION}`;
  const identity=$('#cli .cli-package-identity strong');
  if(identity)identity.textContent=`ytconv@${CLI_VERSION}`;
  const release=$('#cli .cli-release-note');
  if(release)release.innerHTML=`<span class="status-dot"></span><div><strong>Last update: YTConv CLI ${CLI_VERSION}</strong><small>Instagram post dan Reel routing diperbaiki, mode Image ditambahkan, serta pilihan ORIGINAL/JPG/PNG/WEBP tersedia.</small></div>`;
  const status=$('.source-status span:last-child');
  if(status)status.innerHTML=`<strong>YTConv CLI v${CLI_VERSION}</strong><small>Diperbarui ${UPDATED}</small>`;
  const footer=$('.site-footer p:last-child');
  if(footer)footer.textContent=`Last update: YTConv CLI v${CLI_VERSION} · ${UPDATED}.`;
}

function installGuide(){
  const anchor=$('#cli101ISH')||$('#cli100Media')||$('#cli056Update');
  if(!anchor||$('#cli102Instagram'))return;
  anchor.insertAdjacentHTML('beforebegin',`
    <article class="cli-release-card" id="cli102Instagram">
      <div class="cli-release-head">
        <div><p class="kicker">Instagram dan format gambar</p><h3>YTConv 1.0.2 memisahkan Post/Carousel dan Reel dengan benar</h3></div>
        <span class="verified-badge">v${CLI_VERSION}</span>
      </div>
      <p>URL Instagram <code>/p/</code> sekarang memakai gallery-dl untuk gambar dan carousel, sedangkan <code>/reel/</code>, <code>/reels/</code>, dan <code>/tv/</code> memakai yt-dlp untuk video. Parameter pelacak <code>utm_*</code> dan <code>igsh</code> dibersihkan otomatis.</p>
      <div class="cli-command-row">
        <div class="code-shell"><div class="code-head"><span>Post atau carousel</span><button class="copy-code" type="button">Salin</button></div><pre><code>ytconv --image --image-format original "LINK_POST"
ytconv --image --image-format jpg "LINK_POST"</code></pre></div>
        <div class="code-shell"><div class="code-head"><span>Reel video</span><button class="copy-code" type="button">Salin</button></div><pre><code>ytconv --video "LINK_REEL"
ytconv --auto "LINK_REEL"</code></pre></div>
      </div>
      <div class="cli-release-note"><span class="status-dot"></span><div><strong>Pilihan di TUI</strong><small>Tekan <code>Ctrl+G</code> untuk AUTO → VIDEO → AUDIO → IMAGE. Dalam mode IMAGE, tekan <code>Ctrl+F</code> untuk ORIGINAL → JPG → PNG → WEBP.</small></div></div>
      <details class="error-item" data-keywords="instagram post reel no media image format chrome cookies gallery-dl">
        <summary><span><code>Instagram mengatakan tidak ada media</code><small>Update ke 1.0.2 dan periksa cookies</small></span><b>＋</b></summary>
        <div class="error-answer"><p>Versi 1.0.0 melakukan metadata probe yang dapat gagal palsu pada Instagram. Update ke 1.0.2. Bila tetap gagal, tutup Chrome sepenuhnya atau gunakan <code>cookies.txt</code> Netscape yang masih aktif.</p><div class="code-shell"><div class="code-head"><span>Update dan tes</span><button class="copy-code" type="button">Salin</button></div><pre><code>npm install -g ytconv@latest
ytconv --version
ytconv --diagnose</code></pre></div></div>
      </details>
    </article>`);
}

function addError(){
  const list=$('#errorList');
  if(!list||$('#instagramRoutingError'))return;
  list.insertAdjacentHTML('afterbegin',`
    <details class="error-item featured-error" id="instagramRoutingError" data-keywords="instagram p reel carousel image format tidak ada media 1.0.0 1.0.2">
      <summary><span><code>Post atau Reel Instagram gagal di YTConv 1.0.0</code><small>Routing Instagram diperbaiki di 1.0.2</small></span><b>＋</b></summary>
      <div class="error-answer"><div class="code-shell"><div class="code-head"><span>Perbaikan</span><button class="copy-code" type="button">Salin</button></div><pre><code>npm install -g ytconv@latest
ytconv --version</code></pre></div><p>Untuk post/carousel pilih mode IMAGE. Untuk Reel pilih AUTO atau VIDEO. Story dan media login-only memerlukan cookies.</p></div>
    </details>`);
}

function refreshCopyButtons(){
  document.querySelectorAll('.copy-code').forEach(button=>{
    if(button.dataset.cli102Ready)return;
    button.dataset.cli102Ready='true';
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
  installGuide();
  addError();
  refreshCopyButtons();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
