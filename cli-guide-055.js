(()=>{
'use strict';
const CLI_VERSION='0.5.5';
const UPDATED='17 Juli 2026';
const $=(selector,root=document)=>root.querySelector(selector);

function replaceVersionText(){
  const badge=$('#cli .verified-badge');
  if(badge)badge.textContent=`v${CLI_VERSION}`;
  const identity=$('#cli .cli-package-identity strong');
  if(identity)identity.textContent=`ytconv@${CLI_VERSION}`;
  const release=$('#cli .cli-release-note');
  if(release)release.innerHTML=`<span class="status-dot"></span><div><strong>Last update: YTConv CLI ${CLI_VERSION}</strong><small>Open folder/file yang lebih andal, copy path, auto-open, help, diagnostics, serta opsi command-line baru.</small></div>`;
  const status=$('.source-status span:last-child');
  if(status)status.innerHTML=`<strong>YTConv CLI v${CLI_VERSION}</strong><small>Diperbarui ${UPDATED}</small>`;
  const footer=$('.site-footer p:last-child');
  if(footer)footer.textContent=`Last update: YTConv CLI v${CLI_VERSION} · ${UPDATED}.`;

  const meta=$('meta[name="description"]');
  if(meta)meta.content=`Instal YTConv CLI v${CLI_VERSION}, buka folder/file hasil, gunakan diagnostics, dan selesaikan error CMD atau Termux.`;
  const schema=[...document.querySelectorAll('script[type="application/ld+json"]')].find(node=>node.textContent.includes('YTConv CLI'));
  if(schema){
    try{const value=JSON.parse(schema.textContent);value.softwareVersion=CLI_VERSION;schema.textContent=JSON.stringify(value)}catch{}
  }
}

function installFeatureCards(){
  const release=$('#cli .cli-release-note');
  if(!release||$('#cli055Features'))return;
  release.insertAdjacentHTML('beforebegin',`
    <div class="cli-command-row" id="cli055Features">
      <div class="code-shell"><div class="code-head"><span>Help & diagnostics</span><button class="copy-code" type="button">Salin</button></div><pre><code>ytconv --help
ytconv --diagnose</code></pre></div>
      <div class="code-shell"><div class="code-head"><span>Folder dan mode khusus</span><button class="copy-code" type="button">Salin</button></div><pre><code>ytconv --audio --output D:\\Music "LINK"
ytconv --cookies cookies.txt "LINK"</code></pre></div>
    </div>
    <div class="cli-release-note">
      <span class="status-dot"></span>
      <div><strong>Shortcut hasil baru</strong><small><code>O</code> buka folder · <code>F</code> buka file · <code>C</code> copy path · <code>Ctrl+O</code> auto-open · <code>Ctrl+H</code> help · <code>Ctrl+D</code> diagnostics.</small></div>
    </div>`);
}

function installOpenFolderError(){
  const list=$('#errorList');
  if(!list||$('#openFolderError'))return;
  list.insertAdjacentHTML('afterbegin',`
    <details class="error-item featured-error" id="openFolderError" data-keywords="o open folder tidak buka explorer file manager termux documentsui copy path output 0.5.5">
      <summary><span><code>Tekan O tetapi folder tidak terbuka</code><small>Gunakan YTConv 0.5.5 dan periksa aplikasi file manager</small></span><b>＋</b></summary>
      <div class="error-answer">
        <p>YTConv terbaru mencoba beberapa pembuka folder. Jika semuanya gagal, lokasi hasil otomatis disalin ke clipboard dan ditampilkan di layar.</p>
        <div class="code-shell"><div class="code-head"><span>Update dan diagnosis</span><button class="copy-code" type="button">Salin</button></div><pre><code>npm install -g ytconv@latest
ytconv --diagnose</code></pre></div>
        <p>Setelah conversion: tekan <code>O</code> untuk folder, <code>F</code> untuk file, atau <code>C</code> untuk menyalin lokasi hasil.</p>
      </div>
    </details>`);
}

function refreshCopyButtons(){
  document.querySelectorAll('.copy-code').forEach(button=>{
    if(button.dataset.cli055Ready)return;
    button.dataset.cli055Ready='true';
    button.addEventListener('click',async()=>{
      const code=button.closest('.code-shell')?.querySelector('code')?.textContent?.trim();
      if(!code)return;
      try{await navigator.clipboard.writeText(code);button.textContent='Tersalin';setTimeout(()=>button.textContent='Salin',1400)}catch{}
    });
  });
}

function mount(){
  if(!$('#cli')){setTimeout(mount,50);return}
  replaceVersionText();
  installFeatureCards();
  installOpenFolderError();
  refreshCopyButtons();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
