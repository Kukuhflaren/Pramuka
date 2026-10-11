#!/usr/bin/env python3
"""Menambahkan soal dari file CSV ke data/bank-<kategori>.js (tanpa menghapus soal lama).

Kolom CSV (baris pertama = judul kolom):
    kategori,pertanyaan,jawaban,sumber,pengecoh
- kategori : pk, tali, kompas, surv, pppk, topo, atau peta
- sumber   : B (Boyman) atau L (luar Boyman)
- pengecoh : opsional, pisahkan dengan titik koma, contoh:  Simpul Mati;Simpul Anyam;Simpul Jangkar

Pemakaian (dari folder proyek):
    python tools/csv_ke_bank.py soal-baru.csv
"""
import csv, re, sys, os
if len(sys.argv) != 2: sys.exit(__doc__)
base = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data')
quote = lambda s: "'" + s.replace('\\', '\\\\').replace("'", "\\'") + "'"
rows, bad = {}, 0
with open(sys.argv[1], encoding='utf-8-sig', newline='') as f:
    for n, r in enumerate(csv.DictReader(f), start=2):
        k = (r.get('kategori') or '').strip().lower()
        q, a, s = [(r.get(x) or '').strip() for x in ('pertanyaan', 'jawaban', 'sumber')]
        d = (r.get('pengecoh') or '').strip()
        s = s.upper()
        if '|' in q + a + d or not q or not a or s not in ('B', 'L') or not os.path.exists(os.path.join(base, f'bank-{k}.js')):
            print(f'Baris {n} dilewati (cek kategori/sumber/tanda |): {q[:40]}'); bad += 1; continue
        rows.setdefault(k, []).append('|'.join([q, a, s] + ([d] if d else [])))
for k, items in rows.items():
    p = os.path.join(base, f'bank-{k}.js'); txt = open(p, encoding='utf-8').read()
    lama = {re.sub(r"\\'", "'", m).split('|')[0].lower() for m in re.findall(r"^'(.*)',?$", txt, re.M)}
    baru = [i for i in items if i.split('|')[0].lower() not in lama]
    i = txt.rindex('];'); body = txt[:i].rstrip()
    if not body.endswith('['): body += ','
    txt = body + '\n' + ',\n'.join(quote(x) for x in baru) + '\n];\n'
    open(p, 'w', encoding='utf-8').write(txt)
    print(f'{k}: +{len(baru)} soal ditambahkan ({len(items)-len(baru)} ganda dilewati)')
print(f'Selesai. {bad} baris dilewati. Jalankan: node tools/check-bank.js')
