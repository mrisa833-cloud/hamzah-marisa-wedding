# Hamzah & Marisa — Undangan Pernikahan Digital

Website undangan statis, mobile-first, untuk GitHub Pages. RSVP tersimpan di Google Sheets melalui Google Apps Script; ucapan dibaca ulang otomatis setiap 20 detik.

## Struktur proyek

- `index.html` — seluruh section undangan dan formulir RSVP.
- `styles.css` — gaya responsif dan animasi ringan.
- `config.js` — satu tempat untuk mengubah nama, keluarga, jadwal, alamat, nomor DANA, endpoint, dan musik.
- `app.js` — countdown, Calendar, Maps, RSVP, ucapan, tombol salin, dan musik.
- `apps-script/Code.gs` — backend Google Sheets.
- `.github/workflows/pages.yml` — deployment otomatis GitHub Pages setiap push ke `main`.
- `assets/` — letakkan musik MP3 milik/berlisensi Anda di sini.

## 1. Menyiapkan Google Sheets + Apps Script

1. Buat Google Spreadsheet baru, misalnya `RSVP Hamzah & Marisa`.
2. Buka **Extensions → Apps Script**.
3. Ganti isi `Code.gs` dengan file `apps-script/Code.gs` dari proyek ini.
4. Simpan, pilih fungsi `setup`, lalu klik **Run** dan izinkan akses Google. Sheet bernama `RSVP` akan dibuat otomatis.
5. Klik **Deploy → New deployment → Web app**.
6. Pilih **Execute as: Me** dan **Who has access: Anyone** agar tamu tanpa login Google dapat mengirim RSVP. Ini membuat endpoint dapat diakses publik; jangan simpan data sensitif di spreadsheet.
7. Deploy, salin URL Web App yang berakhiran `/exec`.
8. Tempel URL itu ke `rsvpEndpoint` pada `config.js`.
9. Setelah perubahan `config.js` didorong ke GitHub, uji kirim RSVP dan periksa baris baru di sheet. Ucapan tampil setelah polling berikutnya (maksimal sekitar 20 detik).

**Catatan teknis:** browser menggunakan POST `no-cors` agar kompatibel dengan Apps Script. Karena responsnya opaque, tampilan situs hanya dapat mengonfirmasi permintaan telah dikirim, bukan memastikan Google Sheets menerima baris. Verifikasi pengiriman pertama langsung di spreadsheet.

### Kolom spreadsheet

| Kolom | Isi |
|---|---|
| A | Timestamp |
| B | Nama Lengkap |
| C | Kehadiran (`Hadir` / `Tidak Hadir`) |
| D | Jumlah Tamu (0 jika tidak hadir) |
| E | Ucapan |

Semua pengiriman menambah baris baru. Ekspor melalui **File → Download** di Google Sheets.

## 2. Menyiapkan GitHub Pages

1. Buat repository GitHub baru bernama `hamzah-marisa-wedding` (public agar Pages gratis dan mudah diakses).
2. Unggah seluruh isi folder proyek ini ke root repository; jangan unggah folder pembungkus ZIP-nya.
3. Buka **Settings → Pages** dan pilih **GitHub Actions** sebagai Build and deployment source.
4. Push ke branch `main`. Workflow `.github/workflows/pages.yml` akan memublikasikan situs otomatis.
5. URL biasanya `https://USERNAME.github.io/hamzah-marisa-wedding/`. Tunggu workflow selesai dan lihat URL aktual di Settings → Pages.

## 3. Pengaturan dan pembaruan

Ubah semua detail acara di `config.js`:
- Nama pasangan dan nama orang tua di `couple`.
- Nama/alamat/lokasi Maps di `venue`.
- Jadwal dan deskripsi Google Calendar di `events`.
- Hitung mundur di `countdownTarget` (format ISO dengan offset `+07:00`).
- Nomor DANA dan alamat pengiriman di `gift`.
- URL Apps Script di `rsvpEndpoint`.
- Nama file musik di `musicFile`, misalnya `assets/wedding-music.mp3`.

Setelah mengubah file, commit/push ke `main`; GitHub Actions akan deploy ulang. Bila mengubah kode Apps Script, buka Apps Script lalu **Deploy → Manage deployments → Edit → New version → Deploy**.

## 4. Jadwal dan catatan

- Akad: Jumat, 19 Maret 2027, pukul 08.30 WIB hingga selesai.
- Resepsi: Sabtu, 20 Maret 2027, pukul 13.30–18.00 WIB.
- Calendar memerlukan waktu akhir untuk acara akad. Proyek ini mengisi waktu akhir sementara 09.30 WIB; ubah `events.akad.end` setelah durasi dipastikan.
- Tautan Google Maps menggunakan short link yang diberikan. Uji pin sebelum undangan disebarkan.
- Belum ada file musik dalam aset yang tersedia saat proyek ini disiapkan. Musik opsional; tambahkan MP3 Anda sendiri ke `assets/`.

## 5. Checklist sebelum dibagikan

- [ ] `rsvpEndpoint` berisi URL Web App `/exec` yang benar.
- [ ] Pengiriman RSVP uji menambah satu baris di Google Sheets.
- [ ] Ucapan uji tampil di bagian Wedding Wishes.
- [ ] Tautan Maps membuka titik rumah yang benar.
- [ ] Kedua tautan Google Calendar menampilkan tanggal, waktu, lokasi, dan deskripsi yang benar.
- [ ] Waktu akhir akad sudah dikonfirmasi dan diperbarui.
- [ ] Nomor DANA dan alamat hadiah sudah diperiksa.
- [ ] Situs diuji di Android/iPhone dan desktop.
- [ ] Musik ditambahkan hanya bila diinginkan dan hak penggunaannya dimiliki.

## Privasi dan anti-spam

Endpoint RSVP publik diperlukan agar tamu dapat mengirim tanpa login. Jangan menyimpan informasi rahasia di frontend atau sheet publik. Untuk undangan yang disebarkan luas, pertimbangkan CAPTCHA atau pembatasan spam tambahan.
