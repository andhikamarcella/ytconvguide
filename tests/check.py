from pathlib import Path
import json

r=Path(__file__).parents[1]
assert (r/'index.html').exists()
h=(r/'index.html').read_text()
assert 'shared.js' in h and 'shared.css' in h
assert (r/'cli-guide.js').exists()
assert (r/'cli-guide.css').exists()
assert (r/'cli-guide-055.js').exists()
cli=(r/'cli-guide.js').read_text()
patch=(r/'cli-guide-055.js').read_text()
shared=(r/'shared.js').read_text()
assert 'npm install -g ytconv' in cli
assert "CLI_VERSION='0.5.5'" in patch
assert 'ytconv --diagnose' in patch
assert 'Tekan O tetapi folder tidak terbuka' in patch
assert 'spawn …/yt-dlp ENOENT' in cli
assert '/cli-guide.js' in shared and '/cli-guide.css' in shared
assert '/cli-guide-055.js' in shared
assert 'APP_VERSION="2.1.1"' in shared
for f in ['privacy.html','terms.html','security.html','contact.html','robots.txt','sitemap.xml']:
 assert (r/f).exists(), f
for p in r.rglob('*.json'):
 json.loads(p.read_text())
print('OK:',r.name)
