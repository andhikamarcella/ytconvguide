(()=>{
'use strict';
const CLI_VERSION='1.0.1';
const UPDATED='17 Juli 2026';
const INSTALL_URL='https://raw.githubusercontent.com/andhikamarcella/youtubetomp3/codex/add-ytconv-cli/cli/scripts/install-ish.sh';
const $=(selector,root=document)=>root.querySelector(selector);

function updateVersionText(){
  const badge=$('#cli .verified-badge');
  if(badge)badge.textContent=`v${CLI_VERSION}`;
  const identity=$('#cli .cli-package-identity strong');
  if(identity)identity.textContent=`ytconv@${CLI_VERSION}`;
  const release=$('#cli .cli-release-note');
  if(release)release.innerHTML=`<span class="status-dot"></span><div><strong>Last update: YTConv CLI ${CLI_VERSION}</strong><small>Native iSH/iOS installer, video, audio, gambar, carousel, Reels, Stories, CMD, Termux, dan desktop.</small></div>`;
  const status=$('.source-status span:last-child');
  if(status)status.innerHTML=`<strong>YTConv CLI v${CLI_VERSION}</strong><small>Diperbarui ${UPDATED}</small>`;
  const footer=$('.site-footer p:last-child');
  if(footer)footer.textContent=`Last update: YTConv CLI v${CLI_VERSION} · ${UPDATED}.`;
}

function installISHGuide(){
  const anchor=$('#cli100Media')||$('#cli056Update')||$('#cli055Features');
  if(!anchor||$('#cli101ISH'))return;
  anchor.insertAdjacentHTML('beforebegin',`
    <article class="cli-release-card" id="cli101ISH">
      <div class="cli-release-head">
        <div><p class="kicker">iPhone dan iPad</p><h3>YTConv 1.0.1 mendukung iSH melalui frontend Python native</h3></div>
        <span class="verified-badge">v${CLI_VERSION}</span>
      </div>
      <p>iSH App Store memakai Alpine x86 dan sering membawa Node/npm lama. Karena itu YTConv iSH tidak dipasang melalui npm. Installer native menyiapkan Python, yt-dlp, gallery-dl, FFmpeg, command <code>ytconv</code>, serta folder hasil.</p>
      <div class="cli-command-row">
        <div class="code-shell"><div class="code-head"><span>Install di iSH</span><button class="copy-code" type="button">Salin</button></div><pre><code>wget -qO- ${INSTALL_URL} | sh</code></pre></div>
        <div class="code-shell"><div class="code-head"><span>Tes setelah instalasi</span><button class="copy-code" type="button">Salin</button></div><pre><code>ytconv --version
ytconv --diagnose
ytconv</code></pre></div>
      </div>
      <div class="cli-release-note"><span class="status-dot"></span><div><strong>Jangan gunakan npm di iSH</strong><small>Error <code>EBADENGINE</code>, <code>TAR_ENTRY_INVALID</code>, dan <code>ENOTEMPTY</code> berasal dari Node 14/npm 7 lama. Installer native membersihkan sisa instalasi npm YTConv.</small></div></div>
      <details class="error-item" data-keywords="ish ios iphone ipad node 14 ebadengine enotempty tar entry invalid apk nodejs">
        <summary><span><code>npm gagal di iSH</code><small>Gunakan installer native, bukan npm install -g</small></span><b>＋</b></summary>
        <div class="error-answer"><p>Jalankan installer di atas. Hasil tersimpan di <code>~/Downloads/YTConv</code> dan dapat dibuka melalui Files → iSH → root → Downloads → YTConv.</p></div>
      </details>
      <details class="error-item" data-keywords="ish python 3.9 yt-dlp old version youtube gagal ios background slow">
        <summary><span><code>iSH lebih lambat atau situs tertentu gagal</code><small>iSH adalah emulasi x86 dan Python lama memakai yt-dlp kompatibel terakhir</small></span><b>＋</b></summary>
        <div class="error-answer"><p>Jalankan <code>ytconv --diagnose</code>. Python di bawah 3.10 tidak dapat memakai yt-dlp terbaru; sebagian situs terbaru dapat gagal. Jangan pindahkan iSH ke background saat proses berjalan.</p></div>
      </details>
      <details class="error-item" data-keywords="ish cookies safari story instagram private login netscape">
        <summary><span><code>Instagram Story di iSH meminta login</code><small>Gunakan cookies.txt Netscape</small></span><b>＋</b></summary>
        <div class="error-answer"><div class="code-shell"><div class="code-head"><span>Story dengan cookies</span><button class="copy-code" type="button">Salin</button></div><pre><code>ytconv --stories --cookies "$HOME/Downloads/cookies.txt" "PROFILE_URL"</code></pre></div><p>YTConv tidak dapat membaca cookies Safari iOS secara langsung atau membuka akun privat yang tidak dimiliki aksesnya.</p></div>
      </details>
    </article>`);
}

function addISHError(){
  const list=$('#errorList');
  if(!list||$('#ishInstallError'))return;
  list.insertAdjacentHTML('afterbegin',`
    <details class="error-item featured-error" id="ishInstallError" data-keywords="ish ios iphone npm node 14 ebadengine enotempty tar entry invalid install">
      <summary><span><code>YTConv gagal dipasang di iSH/iPhone</code><small>Hapus jalur npm dan gunakan installer Python native</small></span><b>＋</b></summary>
      <div class="error-answer">
        <p>Command <code>pkg</code> hanya untuk Termux Android. iSH menggunakan Alpine <code>apk</code>, tetapi YTConv sudah menyediakan installer lengkap sehingga tidak perlu memasang Node.js.</p>
        <div class="code-shell"><div class="code-head"><span>Perbaikan iSH</span><button class="copy-code" type="button">Salin</button></div><pre><code>wget -qO- ${INSTALL_URL} | sh
ytconv --diagnose</code></pre></div>
      </div>
    </details>`);
}

function refreshCopyButtons(){
  document.querySelectorAll('.copy-code').forEach(button=>{
    if(button.dataset.cli101Ready)return;
    button.dataset.cli101Ready='true';
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
  installISHGuide();
  addISHError();
  refreshCopyButtons();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
