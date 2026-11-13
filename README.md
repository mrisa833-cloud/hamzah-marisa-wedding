# Undangan Digital Hamzah & Marisa

Website undangan statis, mobile-first, untuk acara 19–20 Maret 2027.

## Isi
- `index.html`: website undangan, countdown, detail acara, peta, Google Calendar, RSVP, ucapan, dan informasi hadiah.
- `apps-script/Code.gs`: endpoint Google Apps Script untuk menyimpan RSVP dan menampilkan ucapan dari Google Sheets.
- `.github/workflows/pages.yml`: workflow deploy otomatis ke GitHub Pages.

## 1. Aktifkan Google Sheets untuk RSVP
1. Buat / buka Google Sheet baru di akun Google yang akan menerima RSVP.
2. Pilih **Extensions → Apps Script**.
3. Ganti isi editor dengan seluruh isi file `apps-script/Code.gs`.
4. Jalankan fungsi `setup()` satu kali dan berikan izin yang diminta. Spreadsheet dibuat otomatis; URL-nya dapat dilihat di **Executions / Logs**.
5. Pilih **Deploy → New deployment → Web app**.
6. Set **Execute as: Me** dan **Who has access: Anyone**, lalu Deploy.
7. Salin URL Web App yang berakhiran `/exec`.
8. Di `index.html`, cari `const API_URL=''` lalu tempel URL tersebut di antara tanda kutip.
9. Commit perubahan `index.html` ke GitHub.

Catatan: formulir RSVP memakai POST ke Apps Script. Endpoint GET `?action=wishes` juga disediakan. Untuk menampilkan ucapan secara otomatis di website, tambahkan pemanggilan GET ke URL Web App di bagian script halaman (saat ini daftar ucapan belum diambil otomatis). Batasi akses spreadsheet hanya untuk pemilik/keluarga.

## 2. Aktifkan GitHub Pages
1. Buka **Settings → Pages** pada repositori.
2. Pada **Build and deployment**, pilih **Source: GitHub Actions**.
3. Pastikan workflow `.github/workflows/pages.yml` berjalan pada branch `main`.
4. Setelah workflow sukses, alamat website biasanya:
   `https://mrisa833-cloud.github.io/hamzah-marisa-wedding/`

## 3. Personalisasi
- Detail acara, nama keluarga, alamat, nomor DANA, tautan Maps, dan tanggal berada di `index.html`.
- Musik latar belum ditambahkan karena file audio belum tersedia di repositori. Jika ingin musik, unggah file audio milik sendiri dan tambahkan pemutar audio dengan kontrol yang terlihat.

## Catatan tanggal
Waktu countdown menggunakan zona WIB (UTC+7). Google Calendar saat ini menyimpan pengingat akad pukul 08.30–09.30 WIB sebagai durasi kalender default; ubah jika durasi acara yang sebenarnya berbeda.
