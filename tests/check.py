from pathlib import Path
import json,re,sys
r=Path(__file__).parents[1]
assert (r/'index.html').exists()
h=(r/'index.html').read_text()
assert 'shared.js' in h and 'shared.css' in h
for f in ['privacy.html','terms.html','security.html','contact.html','robots.txt','sitemap.xml']:
 assert (r/f).exists(), f
for p in r.rglob('*.json'):
 json.loads(p.read_text())
print('OK:',r.name)
