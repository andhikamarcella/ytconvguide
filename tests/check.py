from pathlib import Path
import json

r=Path(__file__).parents[1]
assert (r/'index.html').exists()
h=(r/'index.html').read_text()
assert 'shared.js' in h and 'shared.css' in h
for name in ['cli-guide.js','cli-guide.css','cli-guide-055.js','cli-guide-056.js','cli-guide-100.js','cli-guide-101.js','cli-guide-102.js']:
    assert (r/name).exists(), name
cli=(r/'cli-guide.js').read_text()
patch55=(r/'cli-guide-055.js').read_text()
patch56=(r/'cli-guide-056.js').read_text()
patch100=(r/'cli-guide-100.js').read_text()
patch101=(r/'cli-guide-101.js').read_text()
patch102=(r/'cli-guide-102.js').read_text()
shared=(r/'shared.js').read_text()
assert 'npm install -g ytconv' in cli
assert "CLI_VERSION='0.5.5'" in patch55
assert "CLI_VERSION='0.5.6'" in patch56
assert "CLI_VERSION='1.0.0'" in patch100
assert "CLI_VERSION='1.0.1'" in patch101
assert "CLI_VERSION='1.0.2'" in patch102
assert 'ytconv --check-update' in patch56
assert 'ytconv --update' in patch56
assert 'Update YTConv gagal atau versi masih lama' in patch56
assert 'ytconv --diagnose' in patch55
assert 'Tekan O tetapi folder tidak terbuka' in patch55
assert 'spawn …/yt-dlp ENOENT' in cli
assert 'ytconv --image' in patch100
assert 'ytconv --stories' in patch100
assert 'ytconv --all-media' in patch100
assert 'gallery-dl' in patch100
assert 'install-ish.sh' in patch101
assert 'Jangan gunakan npm di iSH' in patch101
assert 'EBADENGINE' in patch101 and 'ENOTEMPTY' in patch101
assert 'Files → iSH → root → Downloads → YTConv' in patch101
assert '--image-format' in patch102
assert 'AUTO → VIDEO → AUDIO → IMAGE' in patch102
assert 'ORIGINAL → JPG → PNG → WEBP' in patch102
assert 'Instagram' in patch102 and 'Reel' in patch102
assert '/cli-guide.js' in shared and '/cli-guide.css' in shared
assert '/cli-guide-055.js' in shared and '/cli-guide-056.js' in shared
assert '/cli-guide-100.js' in shared and '/cli-guide-101.js' in shared and '/cli-guide-102.js' in shared
assert 'APP_VERSION="2.2.2"' in shared
for f in ['privacy.html','terms.html','security.html','contact.html','robots.txt','sitemap.xml']:
    assert (r/f).exists(), f
for p in r.rglob('*.json'):
    json.loads(p.read_text())
print('OK:',r.name)
