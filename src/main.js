const copyButtons = document.querySelectorAll('[data-copy]');
const themeToggle = document.querySelector('.theme-toggle');
const toTop = document.querySelector('.to-top');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') {
  document.documentElement.classList.add('light');
  themeToggle.textContent = '☀️';
}

copyButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const block = button.closest('[data-copy-block]');
    const code = block?.querySelector('code')?.innerText ?? '';

    try {
      await navigator.clipboard.writeText(code);
      button.textContent = 'Copied';
      block.classList.add('copied');
      setTimeout(() => {
        button.textContent = 'Copy';
        block.classList.remove('copied');
      }, 1500);
    } catch {
      button.textContent = 'Gagal';
      setTimeout(() => {
        button.textContent = 'Copy';
      }, 1500);
    }
  });
});

themeToggle.addEventListener('click', () => {
  const isLight = document.documentElement.classList.toggle('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  themeToggle.textContent = isLight ? '☀️' : '🌙';
});

toTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
  toTop.classList.toggle('show', window.scrollY > 480);
});
