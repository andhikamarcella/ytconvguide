(()=>{
'use strict';
if(!/^\/(?:index\.html)?$/.test(location.pathname))return;
if(document.getElementById('cli'))return;

const CLI_VERSION='0.5.4';
const UPDATED='17 Juli 2026';
const $=(selector,root=document)=>root.querySelector(selector);

function installMetadata(){
  const description='Instal YTConv CLI v0.5.4 dari npm, jalankan di CMD atau Termux, lalu cari solusi error npm, cookies, yt-dlp, dan FFmpeg.';
  const meta=$('meta[name="description"]');
  const og=$('meta[property="og:description"]');
  if(meta)meta.content=description;
  if(og)og.content=description;
  const schema=document.createElement('script');
  schema.type='application/ld+json';
  schema.textContent=JSON.stringify({
    '@context':'https://schema.org',
    '@type':'SoftwareApplication',
    name:'YTConv CLI',
    applicationCategory:'MultimediaApplication',
    operatingSystem:'Windows, Linux, macOS, Android Termux',
    softwareVersion:CLI_VERSION,
    downloadUrl:'https://www.npmjs.com/package/ytconv'
  });
  document.head.appendChild(schema);
}

function installNav(){
  const guideLink=$('.nav-link[data-section="guide"]');
  if(!guideLink)return;
  const link=document.createElement('a');
  link.className='nav-link';
  link.href='#cli';
  link.dataset.section='cli';
  link.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4z"/><path d="M7 9l3 3-3 3M12 15h5"/></svg><span>Install YTConv CLI</span>';
  guideLink.before(link);
}

function updateHero(){
  const lead=$('#home .lead');
  if(lead)lead.innerHTML='Cara tercepat sekarang cukup instal Node.js, jalankan <code>npm install -g ytconv</code>, lalu buka YTConv dari CMD atau Termux. Panduan manual tetap tersedia sebagai cadangan.';
  const actions=$('#home .hero-actions');
  if(actions&&!actions.querySelector('[href="#cli"]')){
    const install=document.createElement('a');
    install.className='button primary';
    install.href='#cli';
    install.textContent='Install YTConv CLI';
    actions.prepend(install);
    const firstOld=actions.querySelector('a[href="#requirements"]');
    if(firstOld)firstOld.className='button secondary';
  }
  const status=$('.source-status span:last-child');
  if(status)status.innerHTML=`<strong>YTConv CLI v${CLI_VERSION}</strong><small>Diperbarui ${UPDATED}</small>`;
}

function cliSection(){
  return `
  <section class="conversation section-anchor" id="cli">
    <div class="message user-message compact-user"><div class="message-body"><p>Ada cara paling gampang, cukup pakai npm?</p></div></div>
    <div class="message assistant-message">
      <div class="assistant-avatar">YT</div>
      <div class="message-body">
        <div class="section-title-row cli-title-row">
          <div><p class="kicker">YTConv CLI · rilis terbaru</p><h2>Install sekali, tinggal ketik <code>ytconv</code></h2></div>
          <span class="verified-badge">v${CLI_VERSION}</span>
        </div>
        <p class="section-copy">Paket npm menyiapkan antarmuka converter untuk CMD, Windows Terminal, Linux, macOS, dan Android Termux. Node.js 18 atau lebih baru diperlukan.</p>

        <article class="cli-release-card">
          <div class="cli-release-head">
            <div class="cli-package-identity"><span class="npm-mark">npm</span><div><small>Paket publik</small><strong>ytconv@${CLI_VERSION}</strong></div></div>
            <a class="button secondary" href="https://www.npmjs.com/package/ytconv" target="_blank" rel="noopener noreferrer">Buka npm ↗</a>
          </div>

          <div class="cli-install-grid">
            <article class="cli-install-card">
              <span class="cli-platform-label">Windows · Linux · macOS</span>
              <h3>Install global</h3>
              <p>Pasang sekali, lalu command <code>ytconv</code> dapat dipanggil dari terminal baru.</p>
              <div class="code-shell"><div class="code-head"><span>CMD / Terminal</span><button class="copy-code" type="button">Salin</button></div><pre><code>npm install -g ytconv
ytconv</code></pre></div>
            </article>

            <article class="cli-install-card">
              <span class="cli-platform-label">Android · Termux</span>
              <h3>Cukup Node.js dulu</h3>
              <p>Pada pemakaian pertama, YTConv menyiapkan alat Android yang diperlukan.</p>
              <div class="code-shell"><div class="code-head"><span>Termux</span><button class="copy-code" type="button">Salin</button></div><pre><code>pkg update &amp;&amp; pkg install -y nodejs
termux-setup-storage
npm install -g ytconv
ytconv</code></pre></div>
            </article>
          </div>

          <div class="cli-command-row">
            <div class="code-shell"><div class="code-head"><span>Tanpa install global</span><button class="copy-code" type="button">Salin</button></div><pre><code>npx -y ytconv@latest</code></pre></div>
            <div class="code-shell"><div class="code-head"><span>Update ke versi terbaru</span><button class="copy-code" type="button">Salin</button></div><pre><code>npm install -g ytconv@latest</code></pre></div>
          </div>

          <div class="cli-release-note">
            <span class="status-dot"></span>
            <div><strong>Last update: YTConv CLI ${CLI_VERSION}</strong><small>Perbaikan runner Termux, input paste, cookies, dan dukungan extractor media sosial.</small></div>
          </div>
        </article>

        <a class="cli-support-banner" href="#errors">
          <span class="cli-support-icon">?</span>
          <span><strong>Ada masalah saat install atau convert?</strong><small>Ketik potongan error di bagian Cari error. Solusi npm, CMD, cookies, dan Termux sudah disiapkan.</small></span>
          <b>→</b>
        </a>
      </div>
    </div>
  </section>`;
}

function installCliSection(){
  const requirements=$('#requirements');
  if(!requirements)return;
  requirements.insertAdjacentHTML('afterend',cliSection());
}

function errorItems(){
  return `
  <details class="error-item featured-error" data-keywords="npm install global ytconv e404 etarget no matching version found registry versi belum tersedia 404">
    <summary><span><code>npm E404 / ETARGET</code><small>Versi belum terbaca registry atau nomor versinya salah</small></span><b>＋</b></summary>
    <div class="error-answer"><p>Cek versi yang benar-benar sudah tersedia. Gunakan paket terbaru tanpa menulis nomor versi yang belum ada.</p><div class="code-shell"><div class="code-head"><span>Cek dan install latest</span><button class="copy-code" type="button">Salin</button></div><pre><code>npm view ytconv version
npm install -g ytconv@latest</code></pre></div></div>
  </details>
  <details class="error-item featured-error" data-keywords="npm view masih versi lama setelah publish latest cache registry 0.5.3 0.5.4">
    <summary><span><code>npm view masih menampilkan versi lama</code><small>Registry atau cache belum selesai diperbarui</small></span><b>＋</b></summary>
    <div class="error-answer"><p>Tunggu beberapa menit, bersihkan cache metadata, lalu cek kembali. Jangan publish ulang nomor versi yang sama.</p><div class="code-shell"><div class="code-head"><span>Refresh metadata npm</span><button class="copy-code" type="button">Salin</button></div><pre><code>npm cache clean --force
npm view ytconv version</code></pre></div></div>
  </details>
  <details class="error-item featured-error" data-keywords="ytconv not recognized is not recognized internal external command tidak dikenali path npm global cmd windows">
    <summary><span><code>ytconv tidak dikenali</code><small>Command global belum masuk PATH terminal</small></span><b>＋</b></summary>
    <div class="error-answer"><p>Tutup terminal, buka lagi, lalu pastikan paket global terpasang. Di Windows, folder global npm harus berada di PATH pengguna.</p><div class="code-shell"><div class="code-head"><span>Diagnosis Windows</span><button class="copy-code" type="button">Salin</button></div><pre><code>npm list -g ytconv --depth=0
npm config get prefix
where ytconv</code></pre></div></div>
  </details>
  <details class="error-item featured-error" data-keywords="termux spawn data data com.termux files usr bin yt-dlp enoent conversion failed python module 0.5.4">
    <summary><span><code>Termux: spawn …/yt-dlp ENOENT</code><small>Runner yt-dlp lama hilang atau rusak</small></span><b>＋</b></summary>
    <div class="error-answer"><p>Update ke YTConv ${CLI_VERSION} atau lebih baru. Versi ini menjalankan yt-dlp melalui modul Python yang lebih stabil.</p><div class="code-shell"><div class="code-head"><span>Perbaikan Termux</span><button class="copy-code" type="button">Salin</button></div><pre><code>pkg update
pkg install -y nodejs python ffmpeg
python -m pip install -U --no-cache-dir yt-dlp
npm install -g ytconv@latest
hash -r
ytconv</code></pre></div></div>
  </details>
  <details class="error-item" data-keywords="npx need to install following packages y prompt diam tidak ada hasil termux">
    <summary><span><code>npx berhenti setelah pertanyaan install</code><small>Lewati prompt konfirmasi npm</small></span><b>＋</b></summary>
    <div class="error-answer"><p>Gunakan opsi <code>-y</code> agar npx langsung memasang dan menjalankan versi terbaru.</p><div class="code-shell"><div class="code-head"><span>Jalankan langsung</span><button class="copy-code" type="button">Salin</button></div><pre><code>npx -y ytconv@latest</code></pre></div></div>
  </details>
  <details class="error-item" data-keywords="mouse escape sequence paste ctrl v klik kanan [<2 [<0 kode angka link input 0.5.3">
    <summary><span><code>Paste berubah menjadi [&lt;2;…</code><small>Versi input terminal lama masih terpasang</small></span><b>＋</b></summary>
    <div class="error-answer"><p>Hapus versi global lama lalu pasang ulang YTConv terbaru. Setelah itu tutup dan buka terminal.</p><div class="code-shell"><div class="code-head"><span>Install bersih</span><button class="copy-code" type="button">Salin</button></div><pre><code>npm uninstall -g ytconv
npm install -g ytconv@latest</code></pre></div></div>
  </details>
  <details class="error-item" data-keywords="conversion failed gagal convert diagnosis version node npm yt-dlp ffmpeg report bantuan">
    <summary><span><code>Conversion failed</code><small>Kumpulkan versi alat agar penyebabnya cepat ditemukan</small></span><b>＋</b></summary>
    <div class="error-answer"><p>Update YTConv, coba link publik tanpa cookies, lalu cari potongan error paling akhir di halaman ini.</p><div class="diagnostic-grid"><div class="code-shell"><div class="code-head"><span>Windows / desktop</span><button class="copy-code" type="button">Salin</button></div><pre><code>node -v
npm -v
npm list -g ytconv --depth=0</code></pre></div><div class="code-shell"><div class="code-head"><span>Termux</span><button class="copy-code" type="button">Salin</button></div><pre><code>node -v
npm -v
python -m yt_dlp --version
ffmpeg -version</code></pre></div></div></div>
  </details>`;
}

function installErrors(){
  const list=$('#errorList');
  if(!list)return;
  list.insertAdjacentHTML('afterbegin',errorItems());
  const kicker=$('#errors .kicker');
  if(kicker)kicker.textContent='Pusat bantuan YTConv';
  const title=$('#errors h2');
  if(title)title.textContent='Ketik potongan error';
  const titleBox=$('#errors .error-title-row>div');
  if(titleBox&&!titleBox.querySelector('.error-subcopy'))titleBox.insertAdjacentHTML('beforeend','<p class="error-subcopy">Cari pesan dari npm, CMD, Termux, cookies, yt-dlp, atau FFmpeg.</p>');
}

function updateFooter(){
  const footer=$('.site-footer p:last-child');
  if(footer)footer.textContent=`Last update: YTConv CLI v${CLI_VERSION} · ${UPDATED}.`;
  const quick=$('.mobile-quickbar');
  if(quick)quick.innerHTML='<a href="#cli">Install CLI</a><a href="#errors">Cari error</a><a href="#builder">Command manual</a>';
}

function installCliObserver(){
  const link=$('.nav-link[data-section="cli"]');
  const section=$('#cli');
  if(!link||!section||!('IntersectionObserver' in window))return;
  const observer=new IntersectionObserver(entries=>{
    if(!entries.some(entry=>entry.isIntersecting))return;
    document.querySelectorAll('.nav-link').forEach(item=>item.classList.toggle('active',item===link));
  },{rootMargin:'-18% 0px -64%',threshold:[0,.2,.5]});
  observer.observe(section);
}

installMetadata();
installNav();
updateHero();
installCliSection();
installErrors();
updateFooter();
installCliObserver();
})();
