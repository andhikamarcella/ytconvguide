(()=>{
'use strict';
const CLI_VERSION='0.5.6';
const UPDATED='17 Juli 2026';
const $=(selector,root=document)=>root.querySelector(selector);

function updateVersionText(){
  const badge=$('#cli .verified-badge');
  if(badge)badge.textContent=`v${CLI_VERSION}`;
  const identity=$('#cli .cli-package-identity strong');
  if(identity)identity.textContent=`ytconv@${CLI_VERSION}`;
  const release=$('#cli .cli-release-note');
  if(release)release.innerHTML=`<span class="status-dot"></span><div><strong>Last update: YTConv CLI ${CLI_VERSION}</strong><small>Notifikasi update otomatis, tombol update langsung, pengecekan registry npm, open hasil, diagnostics, dan dukungan CMD/Termux.</small></div>`;
  const status=$('.source-status span:last-child');
  if(status)status.innerHTML=`<strong>YTConv CLI v${CLI_VERSION}</strong><small>Diperbarui ${UPDATED}</small>`;
  const footer=$('.site-footer p:last-child');
  if(footer)footer.textContent=`Last update: YTConv CLI v${CLI_VERSION} · ${UPDATED}.`;
  const meta=$('meta[name="description"]');
  if(meta)meta.content=`Instal YTConv CLI v${CLI_VERSION}, dapatkan notifikasi update otomatis, dan perbarui dari CMD atau Termux.`;
  const schema=[...document.querySelectorAll('script[type="application/ld+json"]')].find(node=>node.textContent.includes('YTConv CLI'));
  if(schema){try{const value=JSON.parse(schema.textContent);value.softwareVersion=CLI_VERSION;schema.textContent=JSON.stringify(value)}catch{}}
}

function installUpdateGuide(){
  const features=$('#cli055Features');
  if(!features||$('#cli056Update'))return;
  features.insertAdjacentHTML('beforebegin',`
    <article class="cli-release-card" id="cli056Update">
      <div class="cli-release-head">
        <div><p class="kicker">Update otomatis</p><h3>YTConv memberi tahu saat versi baru tersedia</h3></div>
        <span class="verified-badge">v${CLI_VERSION}</span>
      </div>
      <p>Saat aplikasi dibuka, YTConv memeriksa npm paling sering sekali setiap enam jam. Jika ada versi baru, pengguna dapat menekan <code>U</code> lalu Enter untuk update sekarang, atau Enter untuk lanjut memakai versi lama.</p>
      <div class="cli-command-row">
        <div class="code-shell"><div class="code-head"><span>Cek dan update</span><button class="copy-code" type="button">Salin</button></div><pre><code>ytconv --check-update
ytconv --update
ytconv --version</code></pre></div>
        <div class="code-shell"><div class="code-head"><span>Update manual</span><button class="copy-code" type="button">Salin</button></div><pre><code>npm install -g ytconv@latest</code></pre></div>
      </div>
      <div class="cli-release-note"><span class="status-dot"></span><div><strong>Setelah update selesai</strong><small>Tutup terminal, buka terminal baru, jalankan <code>ytconv --version</code>, lalu <code>ytconv</code>.</small></div></div>
      <details class="error-item" data-keywords="disable no update check matikan notifikasi update offline registry">
        <summary><span><code>Matikan pengecekan update</code><small>Untuk jaringan terbatas atau pemakaian offline</small></span><b>＋</b></summary>
        <div class="error-answer"><div class="code-shell"><div class="code-head"><span>Satu sesi</span><button class="copy-code" type="button">Salin</button></div><pre><code>ytconv --no-update-check</code></pre></div></div>
      </details>
    </article>`);
}

function installUpdateErrors(){
  const list=$('#errorList');
  if(!list||$('#updateFailedError'))return;
  list.insertAdjacentHTML('afterbegin',`
    <details class="error-item featured-error" id="updateFailedError" data-keywords="update gagal npm permission eacces access denied terbaru versi lama check update 0.5.6">
      <summary><span><code>Update YTConv gagal atau versi masih lama</code><small>Cek registry, update manual, lalu buka terminal baru</small></span><b>＋</b></summary>
      <div class="error-answer">
        <p>Cek versi terbaru yang sudah terbaca npm, jalankan update manual, lalu tutup dan buka kembali terminal agar PATH dan command dimuat ulang.</p>
        <div class="code-shell"><div class="code-head"><span>Perbaikan umum</span><button class="copy-code" type="button">Salin</button></div><pre><code>npm view ytconv version
npm install -g ytconv@latest
ytconv --version</code></pre></div>
        <p>Di Termux jalankan <code>hash -r</code> setelah update. Di Windows, tutup CMD/Windows Terminal lalu buka lagi.</p>
      </div>
    </details>`);
}

function refreshCopyButtons(){
  document.querySelectorAll('.copy-code').forEach(button=>{
    if(button.dataset.cli056Ready)return;
    button.dataset.cli056Ready='true';
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
  installUpdateGuide();
  installUpdateErrors();
  refreshCopyButtons();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
