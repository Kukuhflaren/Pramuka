# Pembuat Soal Pramuka

Aplikasi web (HTML, CSS, JavaScript biasa, tanpa server) untuk membuat soal pramuka secara otomatis: Pengetahuan Kepramukaan, Sandi, Morse, Tali Temali, Kompas, Survival, PPPK, Topografi, dan Pemetaan. Soal tampil dalam format A4 dan bisa diunduh sebagai PDF atau dicetak.

## Cara membuka
Klik dua kali `index.html`. Tidak perlu instalasi. Untuk pengembangan, gunakan ekstensi *Live Server* di VS Code agar halaman otomatis ter-refresh.

Catatan: tombol Download PDF memuat library `html2pdf.js` dari internet (cdnjs), jadi butuh koneksi.

## Struktur folder
```
index.html        Kerangka halaman (layar beranda, setup, hasil)
style.css         Tampilan dan daftar font (@font-face)
js/app.js         Logika aplikasi (layar, pembuatan soal, unduh, cetak)
js/sandi.js       Daftar sandi dan fungsi pengodeannya
data/bank-*.js    Bank soal per kategori
fonts/            Font sandi
tools/            Alat bantu: pemeriksa bank soal, impor dari CSV
```

## Menambah soal
Buka `data/bank-<kategori>.js` (kategori: `pk`, `tali`, `kompas`, `surv`, `pppk`, `topo`, `peta`). Satu soal satu baris:

```
'pertanyaan|jawaban|sumber'
'pertanyaan|jawaban|sumber|pengecoh1;pengecoh2;pengecoh3'
```

- `sumber`: `B` = dari Boyman, `L` = dari luar Boyman. Aplikasi mengambil sekitar 70% soal B dan 30% soal L dari jumlah yang diminta.
- `pengecoh` (opsional): pilihan jawaban salah untuk soal PG. Kalau kosong, aplikasi mengambil pengecoh dari jawaban soal lain di kategori yang sama.
- Jangan pakai tanda `|` di dalam teks. Hindari tanda kutip tunggal `'` (pakai `’` bila perlu). Akhiri tiap baris dengan koma, kecuali baris terakhir.

### Memeriksa bank soal
```
node tools/check-bank.js
```
Menampilkan jumlah soal per kategori, rasio B/L, dan semua kesalahan penulisan atau soal ganda.

### Memasukkan banyak soal sekaligus (dari Excel atau Word)
1. Siapkan tabel dengan kolom: `kategori, pertanyaan, jawaban, sumber, pengecoh` lalu simpan sebagai CSV (UTF-8).
2. Jalankan: `python tools/csv_ke_bank.py soal-baru.csv`
3. Jalankan pemeriksa: `node tools/check-bank.js`

Soal yang sudah ada tidak dihapus, dan soal dengan pertanyaan yang sama dilewati.

## Menambah sandi baru
1. Tambah pasangan `['kode','Nama Sandi']` di daftar `JN` (`js/sandi.js`).
2. Kalau sandi butuh kunci, tambahkan kolom kuncinya di `KF`, dan tampilannya di fungsi `kt`.
3. Tulis fungsi pengodean di objek `E`: `kode:(teks,kunci)=>hasil`.
4. Kalau sandi berfont: taruh file font di `fonts/`, daftarkan `@font-face` di `style.css`, dan tambahkan `kode:'NamaFont'` di `FF` (`js/sandi.js`).

## Publikasi (GitHub Pages)
1. Buat repositori publik di GitHub, lalu `git init`, `git add .`, `git commit`, dan `git push`.
2. Di repositori: Settings → Pages → *Deploy from a branch* → cabang `main`, folder `/ (root)`.
3. Alamat situs: `https://NAMAPENGGUNA.github.io/NAMA-REPO/`

## Penting
- Bank soal dan jawabannya ikut terkirim ke browser, jadi bisa dibaca siapa pun yang membuka kode halaman. Jangan anggap soal di sini rahasia.
- Fitur Simpan memakai `localStorage`, sehingga hanya tersimpan di browser dan perangkat yang sama.
- Kredit dan lisensi font ada di `CREDITS.md`. Lengkapi sebelum publikasi.
